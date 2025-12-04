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
                  Politika e Privatësisë
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
              <!-- Responsive scroll container for wide content like tables -->
              <div class="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                <article
                  class="max-w-none font-poppins text-primary leading-relaxed text-[15px] md:text-[16px]"
                  v-html="html"
                />
              </div>
              <!-- Optional hint for mobile users -->
              <p class="mt-2 text-xs font-poppins text-primary/60 md:hidden">
                Këshillë: Rrëshqitni horizontalisht për të parë të gjitha kolonat e tabelës.
              </p>
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
// Import Markdown as raw text via Vite (?raw). If not available, replace with fetch().
import md from './PrivacyPolicy.md?raw'

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
  html.value = convertMarkdownToHtml(md)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})

// Minimal Markdown converter with responsive table support
function convertMarkdownToHtml(md) {
  let out = md.replace(/\r\n/g, '\n')

  // Horizontal rules
  out = out.replace(/^\s*---\s*$/gm, '<hr class="my-4 border-0 h-px bg-primary/10">')

  // Headings
  out = out.replace(/^###\s+(.*)$/gm, '<h3 class="mt-5 mb-2 text-kollektif-bold">$1</h3>')
  out = out.replace(/^##\s+(.*)$/gm, '<h2 class="mt-6 mb-3 text-kollektif-bold">$1</h2>')
  out = out.replace(/^#\s+(.*)$/gm, '<h1 class="mt-6 mb-3 text-kollektif-bold">$1</h1>')

  // Bold / Italic
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="text-secondary underline hover:no-underline break-words" href="$2" target="_blank" rel="noopener">$1</a>'
  )

  // Tables
  out = convertTables(out)

  // Ordered lists
  out = wrapListBlocks(out, 'ol', /^\s*\d+\.\s+/)

  // Unordered lists
  out = wrapListBlocks(out, 'ul', /^\s*-\s+/)

  // Paragraphs
  out = out.split('\n').map(line => {
    const t = line.trim()
    const isTag = /^<\s*(h\d|hr|ul|ol|li|p|a|strong|em|table|thead|tbody|tr|th|td|div)/i.test(t)
    const isEmpty = t === ''
    const isListItem = /^\s*(?:-|\d+\.)\s+/.test(line)
    if (isTag || isEmpty || isListItem) return line
    return `<p class="my-3 break-words">${t}</p>`
  }).join('\n')

  return out
}

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

// Convert Markdown tables (pipes) to responsive HTML tables
function convertTables(text) {
  const lines = text.split('\n')
  let result = []
  let i = 0

  while (i < lines.length) {
    const headerLine = lines[i]
    const isTableHeader = headerLine.trim().startsWith('|') && headerLine.trim().endsWith('|')
    if (isTableHeader && i + 1 < lines.length) {
      const sepLine = lines[i + 1]
      const isSeparator = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(sepLine)
      if (isSeparator) {
        const headers = parseTableRow(headerLine)
        i += 2
        let bodyRows = []
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          bodyRows.push(parseTableRow(lines[i]))
          i++
        }

        // Wrap table in a responsive container that allows horizontal scrolling
        const tableHtml = [
          '<div class="overflow-x-auto w-full">',
          '<table class="min-w-[640px] md:min-w-[768px] my-4 border border-primary/10 rounded-lg overflow-hidden text-left text-[13px] md:text-[14px]">',
          '<thead class="bg-primary/5">',
          '<tr>',
          ...headers.map(h => `<th class="px-3 py-2 text-kollektif-bold text-primary border-b border-primary/10 align-top whitespace-nowrap">${h}</th>`),
          '</tr>',
          '</thead>',
          '<tbody>'
        ]
        for (const row of bodyRows) {
          tableHtml.push('<tr class="odd:bg-white even:bg-primary/3">')
          for (let c = 0; c < headers.length; c++) {
            const cell = row[c] ?? ''
            tableHtml.push(`<td class="px-3 py-2 text-primary border-b border-primary/10 align-top break-words">${cell}</td>`)
          }
          tableHtml.push('</tr>')
        }
        tableHtml.push('</tbody></table></div>')
        result.push(tableHtml.join(''))
        continue
      }
    }
    result.push(headerLine)
    i++
  }

  return result.join('\n')
}

function parseTableRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split('|').map(cell => cell.trim())
}
</script>

<style scoped>
/* Bridges for your utilities if not globally available */
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

/* Subtle table row bg */
.even\:bg-primary\/3:nth-child(even) {
  background-color: color-mix(in oklab, var(--color-primary, #0b1221) 3%, transparent);
}

/* Prevent table containers from stretching excessively on small screens */
article table {
  width: 100%;
}
article table th,
article table td {
  word-break: break-word;
}

/* Tokens (override with your exact values or remove if you have utilities) */
:root {
  --color-primary: #0b1221;   /* replace with your primary */
  --color-secondary: #2b6cb0; /* replace with your secondary */
  --font-poppins: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --font-kollektif: 'Kollektif', var(--font-poppins);
}
</style>