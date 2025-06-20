<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">
                {{ alertType === 'upload' ? 'Upload Limit Exceeded' : 'Export Limit Exceeded' }}
              </h3>
            </div>
          </div>
  
          <!-- Content -->
          <div class="mb-6">
            <p class="text-sm text-gray-600 mb-4">
              {{ alertType === 'upload' 
                ? 'Your upload exceeds one or more account limitations:' 
                : 'You have reached your account limitations:' 
              }}
            </p>
  
            <!-- Violations List -->
            <div class="space-y-2">
              <div 
                v-for="violation in violations" 
                :key="violation.type"
                class="p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-4 w-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-2">
                    <p class="text-sm text-red-700">{{ getViolationMessage(violation) }}</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Current Usage Summary -->
            <div v-if="usage" class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Current Usage This Month:</h4>
              <div class="space-y-1 text-xs text-gray-600">
                <div v-if="typeof usage.videos !== 'undefined'" class="flex justify-between">
                  <span>Videos uploaded:</span>
                  <span>{{ usage.videos }}{{ limits && limits.videos_per_month ? `/${limits.videos_per_month}` : '' }}</span>
                </div>
                <div v-if="typeof usage.minutes !== 'undefined'" class="flex justify-between">
                  <span>Minutes processed:</span>
                  <span>{{ formatMinutes(usage.minutes) }}{{ limits && limits.total_minutes_per_month ? `/${limits.total_minutes_per_month} min` : '' }}</span>
                </div>
                <div v-if="typeof usage.srt_exports !== 'undefined'" class="flex justify-between">
                  <span>SRT exports:</span>
                  <span>{{ usage.srt_exports }}{{ limits && limits.srt_exports_per_month ? `/${limits.srt_exports_per_month}` : '' }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              v-if="showUpgradeButton"
              @click="$emit('upgrade')"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useQuotaCheck } from '../composables/useQuotaCheck.js';
  
  export default {
    name: 'QuotaAlertModal',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      violations: {
        type: Array,
        default: () => []
      },
      usage: {
        type: Object,
        default: null
      },
      limits: {
        type: Object,
        default: null
      },
      alertType: {
        type: String,
        default: 'upload', // 'upload' or 'export'
        validator: value => ['upload', 'export'].includes(value)
      },
      showUpgradeButton: {
        type: Boolean,
        default: true
      }
    },
    emits: ['close', 'upgrade'],
    setup() {
      const { getViolationMessage } = useQuotaCheck();
  
      function formatMinutes(minutes) {
        if (minutes < 60) {
          return `${Math.round(minutes * 10) / 10} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round((minutes % 60) * 10) / 10;
        return `${hours}h ${remainingMinutes}m`;
      }
  
      return {
        getViolationMessage,
        formatMinutes
      };
    }
  };
  </script>