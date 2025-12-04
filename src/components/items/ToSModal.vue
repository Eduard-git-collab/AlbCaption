<template>
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="open"
          class="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
          @keydown.esc.prevent="close"
          @click.self="close"
        >
          <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
            <div
              ref="panelRef"
              class="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl ring-1 ring-primary/10"
              role="dialog"
              aria-modal="true"
            >
              <!-- Header -->
              <div class="sticky top-0 bg-white backdrop-blur px-5 md:px-6 py-4 border-b border-primary/10 rounded-t-2xl flex items-center justify-between">
                <div class="w-full">
                  <h2 class="text-lg md:text-xl font-poppins text-primary text-kollektif-bold">
                    Kushtet e Përdorimit
                  </h2>
                </div>
                <button
                  class="inline-flex items-center justify-center w-8 h-8 rounded-md text-primary hover:bg-primary/5 transition"
                  @click="close"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 6l12 12M18 6L6 18"/>
                  </svg>
                </button>
              </div>
  
              <!-- Content -->
              <div class="px-5 md:px-6 py-5">
                <article
                  class="max-w-none font-poppins text-primary leading-relaxed text-[15px] md:text-[16px]"
                  v-html="html"
                />
              </div>
  
              <!-- Footer -->
              <div class="px-5 md:px-6 py-4 border-t border-primary/10 flex justify-end gap-3">
                <button
                  class="px-4 py-2 rounded-md font-poppins text-secondary hover:bg-secondary/10 transition"
                  @click="close"
                >
                  Mbyll
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import tosMd from './tos.md?raw'
  
  const props = defineProps({
    open: { type: Boolean, default: false }
  })
  
  const emit = defineEmits(['update:open'])
  const panelRef = ref(null)
  const html = ref('')
  
  function close() {
    emit('update:open', false)
  }
  
  function onKeyDown(e) {
    if (e.key === 'Escape' && props.open) close()
  }
  
  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    html.value = convertMarkdownToHtml(tosMd)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
  
  // Minimal Markdown to HTML converter tailored for your ToS
  function convertMarkdownToHtml(md) {
    let out = md
  
    // Normalize line breaks
    out = out.replace(/\r\n/g, '\n')
  
    // Horizontal rules: lines with --- alone
    out = out.replace(/^\s*---\s*$/gm, '<hr class="my-4 border-0 h-px bg-primary/10">')
  
    // Headings: ###, ##, #
    out = out.replace(/^###\s+(.*)$/gm, '<h3 class="mt-5 mb-2 text-kollektif-bold">$1</h3>')
    out = out.replace(/^##\s+(.*)$/gm, '<h2 class="mt-6 mb-3 text-kollektif-bold">$1</h2>')
    out = out.replace(/^#\s+(.*)$/gm, '<h1 class="mt-6 mb-3 text-kollektif-bold">$1</h1>')
  
    // Bold and italic: **bold**, *italic*
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
    // Links: [text](url)
    out = out.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="text-secondary underline hover:no-underline" href="$2" target="_blank" rel="noopener">$1</a>'
    )
  
    // Ordered list items: lines starting with "1. ", "2. " etc.
    // We wrap contiguous list items into <ol>
    out = wrapListBlocks(out, 'ol', /^\s*\d+\.\s+/)
  
    // Unordered list items: lines starting with "- "
    out = wrapListBlocks(out, 'ul', /^\s*-\s+/)
  
    // Remaining paragraph lines: wrap non-empty lines that are not already HTML tags
    out = out.split('\n').map(line => {
      const isTag = /^<\s*(h\d|hr|ul|ol|li|p|a|strong|em)/i.test(line.trim())
      const isEmpty = line.trim() === ''
      const isListItem = /^\s*(?:-|\d+\.)\s+/.test(line)
      if (isTag || isEmpty || isListItem) return line
      // Keep trailing colon or period spacing naturally
      return `<p class="my-3">${line.trim()}</p>`
    }).join('\n')
  
    return out
  }
  
  // Helper: wrap contiguous list lines into <ul> or <ol>
  function wrapListBlocks(text, tag, itemRegex) {
    const lines = text.split('\n')
    let result = []
    let inList = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (itemRegex.test(line)) {
        if (!inList) {
          result.push(`<${tag} class="my-3 ml-5 ${tag === 'ul' ? 'list-disc' : 'list-decimal'}">`)
          inList = true
        }
        const item = line.replace(itemRegex, '')
        result.push(`<li>${item.trim()}</li>`)
      } else {
        if (inList) {
          result.push(`</${tag}>`)
          inList = false
        }
        result.push(line)
      }
    }
    if (inList) result.push(`</${tag}>`)
    return result.join('\n')
  }
  </script>
  
  <style scoped>
  /* Bridges in case your utilities aren’t globally available */
  .text-kollektif-bold {
    font-weight: 700;
    font-family: var(--font-kollektif, inherit);
  }
  .font-poppins {
    font-family: var(--font-poppins, inherit);
  }
  .text-primary {
    color: var(--color-primary, #0b1221);
  }
  .text-secondary {
    color: var(--color-secondary, #2b6cb0);
  }
  .bg-primary\/5 {
    background-color: color-mix(in oklab, var(--color-primary, #0b1221) 5%, transparent);
  }
  .ring-primary\/10 {
    --tw-ring-color: color-mix(in oklab, var(--color-primary, #0b1221) 10%, transparent);
  }
  .border-primary\/10 {
    border-color: color-mix(in oklab, var(--color-primary, #0b1221) 10%, transparent);
  }
  </style>