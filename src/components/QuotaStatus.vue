<template>
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Account Usage</h3>
      
      <div v-if="isLoading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="text-sm text-gray-600 mt-2">Loading usage data...</p>
      </div>
  
      <div v-else-if="error" class="text-center py-4">
        <svg class="h-8 w-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm text-red-600">{{ error }}</p>
        <button 
          @click="refresh"
          class="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
  
      <div v-else-if="quotaStatus" class="space-y-4">
        <!-- Plan Info -->
        <div class="pb-3 border-b border-gray-200">
          <h4 class="font-medium text-gray-700">{{ quotaStatus.role.name }}</h4>
          <p class="text-sm text-gray-500">Current plan</p>
        </div>
  
        <!-- Usage Bars -->
        <div class="space-y-3">
          <!-- Videos -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">Videos this month</span>
              <span class="text-sm text-gray-600">
                {{ quotaStatus.usage.videos.used }}/{{ quotaStatus.usage.videos.limit }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getUsageBarColor(quotaStatus.usage.videos.percentage)"
                :style="{ width: Math.min(quotaStatus.usage.videos.percentage, 100) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ Math.max(0, quotaStatus.usage.videos.limit - quotaStatus.usage.videos.used) }} remaining
            </p>
          </div>
  
          <!-- Minutes -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">Minutes this month</span>
              <span class="text-sm text-gray-600">
                {{ formatMinutes(quotaStatus.usage.minutes.used) }}/{{ formatMinutes(quotaStatus.usage.minutes.limit) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getUsageBarColor(quotaStatus.usage.minutes.percentage)"
                :style="{ width: Math.min(quotaStatus.usage.minutes.percentage, 100) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatMinutes(Math.max(0, quotaStatus.usage.minutes.limit - quotaStatus.usage.minutes.used)) }} remaining
            </p>
          </div>
  
          <!-- SRT Exports -->
          <div v-if="quotaStatus.role.srt_exports_per_month">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">SRT exports this month</span>
              <span class="text-sm text-gray-600">
                {{ quotaStatus.usage.srt_exports.used }}/{{ quotaStatus.usage.srt_exports.limit }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getUsageBarColor(quotaStatus.usage.srt_exports.percentage)"
                :style="{ width: Math.min(quotaStatus.usage.srt_exports.percentage, 100) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ Math.max(0, quotaStatus.usage.srt_exports.limit - quotaStatus.usage.srt_exports.used) }} remaining
            </p>
          </div>
          
          <div v-else>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">SRT exports this month</span>
              <span class="text-sm text-green-600">Unlimited</span>
            </div>
            <div class="text-xs text-gray-500">
              {{ quotaStatus.usage.srt_exports.used }} exports this month
            </div>
          </div>
        </div>
  
        <!-- Plan Limits -->
        <div class="pt-3 border-t border-gray-200">
          <h5 class="text-sm font-medium text-gray-700 mb-2">Plan Limits</h5>
          <div class="space-y-1 text-xs text-gray-600">
            <div class="flex justify-between">
              <span>Max file size:</span>
              <span>{{ quotaStatus.role.max_file_size_mb }}MB</span>
            </div>
            <div class="flex justify-between">
              <span>Max video duration:</span>
              <span>{{ quotaStatus.role.max_video_duration }} min</span>
            </div>
          </div>
        </div>
  
        <!-- Refresh Button -->
        <div class="pt-2">
          <button 
            @click="refresh"
            class="w-full text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh usage data
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { useQuotaCheck } from '../composables/useQuotaCheck.js';
  
  export default {
    name: 'QuotaStatus',
    props: {
      userId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const { quotaStatus, isLoading, error, fetchQuotaStatus } = useQuotaCheck();
  
      function formatMinutes(minutes) {
        if (minutes < 60) {
          return `${Math.round(minutes * 10) / 10} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round((minutes % 60) * 10) / 10;
        return `${hours}h ${remainingMinutes}m`;
      }
  
      function getUsageBarColor(percentage) {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
      }
  
      async function refresh() {
        if (props.userId && props.userId !== 'no-user-id') {
          try {
            await fetchQuotaStatus(props.userId);
          } catch (err) {
            console.error('Failed to fetch quota status:', err);
          }
        }
      }
  
      // Load data on mount and when userId changes
      onMounted(refresh);
      watch(() => props.userId, refresh);
  
      return {
        quotaStatus,
        isLoading,
        error,
        formatMinutes,
        getUsageBarColor,
        refresh
      };
    }
  };
  </script>