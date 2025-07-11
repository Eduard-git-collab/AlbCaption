# FileUploadArea Component

A reusable Vue.js component for handling file drag/drop and selection functionality.

## Features

- **Drag and Drop**: Full drag/drop support with visual feedback
- **File Validation**: Type and size validation with customizable limits  
- **Error Handling**: Comprehensive error display and event emission
- **Reusable**: Completely self-contained and configurable
- **Accessible**: Click to upload functionality for keyboard users
- **Visual Feedback**: Dynamic styling for drag states

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxFileSize` | Number | `100 * 1024 * 1024` (100MB) | Maximum file size in bytes |
| `acceptedTypes` | Array | `['video/mp4', 'video/quicktime', 'video/webm']` | Array of accepted MIME types |
| `currentFile` | File | `null` | Currently selected file for display |
| `title` | String | `'Upload File'` | Component title |
| `showTitle` | Boolean | `true` | Show/hide title |
| `dropText` | String | `'Drop file here or click to upload'` | Text shown in drop zone |
| `showFileInfo` | Boolean | `true` | Show/hide file info display |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `file-selected` | `File` | Emitted when a valid file is selected |
| `validation-error` | `String` | Emitted when file validation fails |
| `file-cleared` | `none` | Emitted when file is removed |

## Usage Examples

### Basic Video Upload
```vue
<template>
  <FileUploadArea
    :current-file="videoFile"
    @file-selected="handleFileSelected"
    @validation-error="handleValidationError"
    @file-cleared="handleFileCleared"
  />
</template>

<script setup>
import FileUploadArea from './subcomponents/FileUploadArea.vue'
import { ref } from 'vue'

const videoFile = ref(null)

const handleFileSelected = (file) => {
  videoFile.value = file
  console.log('File selected:', file.name)
}

const handleValidationError = (error) => {
  console.error('Validation error:', error)
}

const handleFileCleared = () => {
  videoFile.value = null
  console.log('File cleared')
}
</script>
```

### Custom Configuration (Images)
```vue
<FileUploadArea
  :max-file-size="10 * 1024 * 1024"
  :accepted-types="['image/jpeg', 'image/png', 'image/gif']"
  :current-file="imageFile"
  title="Upload Image"
  drop-text="Drop image here or click to select"
  @file-selected="handleImageSelected"
  @validation-error="handleValidationError"
  @file-cleared="handleImageCleared"
/>
```

### Minimal UI (No Title/File Info)
```vue
<FileUploadArea
  :max-file-size="5 * 1024 * 1024"
  :accepted-types="['application/pdf']"
  :show-title="false"
  :show-file-info="false"
  drop-text="Drop PDF here"
  @file-selected="handlePdfSelected"
  @validation-error="handleValidationError"
  @file-cleared="handlePdfCleared"
/>
```

## Integration

The component has been integrated into the existing `NewUpload.vue` component, replacing the inline file upload functionality with a reusable, configurable component.

### Before (Inline Implementation)
- Hard-coded drag/drop logic in NewUpload.vue
- Fixed file validation rules
- Non-reusable code
- ~50 lines of template and logic

### After (Component-based)
- Reusable FileUploadArea component
- Configurable validation rules  
- Clean separation of concerns
- ~10 lines in parent component

## File Structure

```
src/components/
├── subcomponents/
│   └── FileUploadArea.vue     # New reusable component
├── NewUpload.vue              # Updated to use FileUploadArea
└── FileUploadTest.vue         # Test component (can be removed)
```

## Validation

The component provides comprehensive file validation:

- **File Type**: Validates against accepted MIME types
- **File Size**: Validates against maximum file size limit
- **Error Messages**: Clear, user-friendly error messages
- **Event Emission**: Errors emitted to parent for handling

## Styling

The component uses Tailwind CSS classes and includes:

- Responsive design
- Hover states
- Focus states  
- Drag feedback
- Error states
- File info display

## Browser Support

Works in all modern browsers that support:
- File API
- Drag and Drop API
- Vue.js 3.x