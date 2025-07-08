<template>
    
    <div class="min-h-screen bg-white">
        <div class="p-3 max-w-full">
            <div class="flex flex-col gap-4 max-w-full min-h-screen">
                <!-- Header Dashboard -->
                <div class="w-full dashboard rounded-2xl shadow-md py-3 flex-shrink-0">
                    <div v-if="loading" class="flex justify-center items-center h-64">
                        <div class="animate-spin rounded-full h-12 w-12 border-dotted border-2 border-stone-700"></div>
                    </div>
                    <div v-else-if="userData" class="flex flex-col gap-1.5 w-full p-4">
                        <div class="w-full flex flex-row justify-between items-center px-4 py-2">
                            <router-link to="/" class="flex items-center gap-2">
                                <Albcaptions_logo class="w-12 h-12"/>
                                <h1 class="text-xl font-poppins font-bold text-charcoal1">Albcaption</h1>
                            </router-link>
                            <div class="flex flex-row justify-center items-center gap-4 font-poppins font-normal">
                                <button class="text-charcoal1 hover:text-charcoal2 hover:font-bold transition-all duration-100 ease-in cursor-pointer">Dashboard</button>
                                
                                <!-- Manage Profile Dropdown -->
                                <div class="relative inline-block text-left group">
                                    <div class="text-charcoal1 hover:text-charcoal2 hover:font-bold transition-all duration-100 ease-in cursor-pointer inline-flex items-center mr-2">
                                        Manage Profile
                                        <svg class="h-5 w-5 group-hover:rotate-180 transition-all duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    
                                    <!-- Profile Dropdown Menu -->
                                    <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                                        <div class="py-1" role="menu" aria-orientation="vertical">
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <button @click="promptProfileView" class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                                                    </svg>
                                                    View Profile
                                                </button>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                    </svg>
                                                    Account Settings
                                                </div>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                                    </svg>
                                                    Billing & Subscription
                                                </div>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.257-0.257A6 6 0 1118 8zM10 2a1 1 0 011 1v4a1 1 0 11-2 0V3a1 1 0 011-1z" clip-rule="evenodd" />
                                                    </svg>
                                                    Privacy Settings
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                
                                <!-- Manage Roles Dropdown (Admin Only) -->
                                <div v-if="isAdmin()" class="relative inline-block text-left group">
                                    <div class="text-charcoal1 hover:text-charcoal2 hover:font-bold transition-all duration-100 ease-in cursor-pointer inline-flex items-center">
                                        Manage Roles
                                        <svg class="h-5 w-5 group-hover:rotate-180 transition-all duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    
                                    <!-- Roles Dropdown Menu -->
                                    <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                                        <div class="py-1" role="menu" aria-orientation="vertical">
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                                        <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                                                    </svg>
                                                    View All Users
                                                </div>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                                                    </svg>
                                                    Add New User
                                                </div>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                    </svg>
                                                    Role Permissions
                                                </div>
                                            </a>
                                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150" role="menuitem">
                                                <div class="flex items-center">
                                                    <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                                    </svg>
                                                    Subscription Management
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                
                                <button @click="handleSignOut" class="text-rust hover:text-rust2 hover:font-bold transition-all duration-100 ease-in cursor-pointer">Sign Out</button>
                            </div>
                        </div>
                        <h1 class="text-xl font-poppins font-bold text-charcoal1 px-4 my-3">Welcome Back {{ userData?.name }} {{userData?.surname}}</h1>
                        
                        <!--QUOTA CARDS-->
                        <div class="w-full flex flex-col sm:flex-row px-5 gap-3">
                            <div class="flex-1 min-w-0 rounded-xl bg-white/60 p-3 flex flex-col gap-4">
                                <h1 class="text-md font-bold text-charcoal1">
                                    Videos Remaining
                                </h1>
                                <div class="flex flex-row items-baseline justify-between">
                                   <div class="flex flex-row items-baseline">
                                        <h2 class="text-2xl sm:text-4xl font-bold text-charcoal1">{{userRoleDetails?.videos_remaining}}</h2>
                                    </div> 
                                    <div class="flex items-center justify-center bg-rust-2 w-9 h-9 rounded-full flex-shrink-0">
                                        <VideoIcon class="w-5 h-5 fill-rust ml-1"/>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0 rounded-xl bg-white/60 p-3 flex flex-col gap-4">
                                <h1 class="text-md font-bold text-charcoal1">
                                    Minutes Remaining
                                </h1>
                                <div class="flex flex-row items-baseline justify-between">
                                   <div class="flex flex-row items-baseline">
                                        <h2 class="text-2xl sm:text-4xl font-bold text-charcoal1">{{userRoleDetails?.minutes_remaining}}</h2>
                                    </div> 
                                    <div class="flex items-center justify-center bg-mint w-9 h-9 rounded-full flex-shrink-0">
                                        <Time class="w-5 h-5 fill-mint2"/>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0 rounded-xl bg-white/60 p-3 flex flex-col gap-4">
                                <h1 class="text-md font-bold text-charcoal1">
                                    Current Subscription 
                                </h1>
                                <div class="flex flex-row items-baseline justify-between">
                                   <div class="flex flex-row items-baseline">
                                        <h2 class="text-xl sm:text-4xl font-bold text-charcoal1">{{userRoleDetails?.role_name}}</h2>
                                    </div> 
                                    <div class="flex items-center justify-center bg-lavender w-9 h-9 rounded-full flex-shrink-0">
                                        <Save class="w-5 h-5 fill-lavender2"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
    
                <!-- Main Content Area -->
                <div class="flex-1 w-full flex flex-col lg:flex-row gap-4 min-h-0">
                    <!-- Filter panel -->
                    <div class="w-full lg:w-1/4 lg:max-h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-600 flex-shrink-0">
                        <div class="sticky top-0 bg-white z-10 px-4 py-2 flex items-center justify-between border-b lg:border-b-0 border-gray-200">
                            <h2 class="text-lg font-poppins font-bold text-charcoal1">Filters</h2>
                            <button @click="clearFilters" class="px-3 py-1 cursor-pointer bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-all duration-150">
                                Reset
                            </button>
                        </div>
                        <div class="flex flex-col gap-2 px-6 pb-4">
                            <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">Search</label>
                            <input
                            v-model="searchFilename"
                            type="text"
                            placeholder="Enter Video Name..."
                            class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                            />
                            <label class="text-sm font-poppins text-charcoal1 mt-3">Date Range</label>
                            <div>
                                <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">From Date</label>
                                <input
                                v-model="dateFrom"
                                type="date"
                                class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">To Date</label>
                                <input
                                v-model="dateTo"
                                type="date"
                                class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                            <div class="flex justify-between flex-col gap-2 mt-3">
                                <div class="w-full">
                                    <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">Sort By</label>
                                    <select
                                      v-model="sortBy"
                                      class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                                    >
                                      <option value="created_at">Date Created</option>
                                      <option value="original_filename">Filename</option>
                                      <option value="duration">Duration</option>
                                      <option value="file_size">File Size</option>
                                    </select>
                                </div>
                                <div class="w-full">
                                    <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">Order:</label>
                                    <select
                                    v-model="sortOrder"
                                    class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                                    >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <span class="block text-sm font-medium font-poppins text-charcoal1">Quick dates:</span>
                                <div class="flex flex-row w-full gap-2 justify-between">
                                    <button @click="setDatePreset(1)" class="px-2 py-1 border-gray-600 border rounded-lg text-charcoal placeholder-gray-400 focus:outline-none hover:bg-gray-100 transition-all duration-150 text-sm">Today</button>
                                    <button @click="setDatePreset(7)" class="px-2 py-1 border-gray-600 border rounded-lg text-charcoal placeholder-gray-400 focus:outline-none hover:bg-gray-100 transition-all duration-150 text-sm">7 days</button>
                                    <button @click="setDatePreset(30)" class="px-2 py-1 border-gray-600 border rounded-lg text-charcoal placeholder-gray-400 focus:outline-none hover:bg-gray-100 transition-all duration-150 text-sm">30 days</button>
                                </div>
                            </div>
    
                            <!-- Items Per Page Selector -->
                            <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-300">
                                <label class="block text-sm font-medium font-poppins text-charcoal1 mb-2">Show per page:</label>
                                <select
                                    v-model="itemsPerPage"
                                    @change="resetToFirstPage"
                                    class="w-full px-3 py-2 border border-gray-600 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none"
                                >
                                    <option value="12">12 videos</option>
                                    <option value="24">24 videos</option>
                                    <option value="48">48 videos</option>
                                    <option value="96">96 videos</option>
                                    <option value="all">Show all</option>
                                </select>
                            </div>
                        </div>
                    </div>
    
                    <!-- Video Cards Grid -->
                    <div class="flex-1 lg:w-3/4 min-h-0 flex flex-col">
                        <!-- Results Summary and Pagination Info -->
                        <div class="flex-shrink-0 px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div class="text-sm text-gray-600 font-poppins">
                                <span v-if="filteredTransactions.length > 0">
                                    Showing {{ ((currentPage - 1) * parseInt(itemsPerPage)) + 1 }} to 
                                    {{ Math.min(currentPage * parseInt(itemsPerPage), totalFilteredItems) }} 
                                    of {{ totalFilteredItems }} videos
                                </span>
                                <span v-else>No videos found</span>
                            </div>
                            <div v-if="itemsPerPage !== 'all' && totalPages > 1" class="text-sm text-gray-600 font-poppins">
                                Page {{ currentPage }} of {{ totalPages }}
                            </div>
                        </div>
    
                        <div class="flex-1 overflow-y-auto">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
                                <div v-for="(transaction, index) in paginatedTransactions" 
                                     :key="transaction.id || index" 
                                     class="bg-gray-200 bg-opacity-40 shadow-md p-4 rounded-lg flex flex-col max-w-full">
                                    
                                    <h3 class="text-lg font-semibold mb-3 truncate">
                                        <a class="cursor-pointer text-charcoal1 hover:underline"
                                           @click="goToDetails(transaction.id)">
                                            {{ transaction.original_filename.length > 25 ? 
                                                transaction.original_filename.substring(0, 25) + '...' : 
                                                transaction.original_filename }}
                                        </a>
                                    </h3>
                                    
                                    <div v-if="transaction.video_url" class="mb-4 flex-shrink-0">
                                        <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                            <video 
                                                :src="transaction.video_url" 
                                                class="absolute inset-0 w-full h-full object-cover" 
                                                controls
                                                preload="metadata"
                                            ></video>
                                        </div>
                                    </div>
                                    
                                    <p v-else class="text-yellow-400 mb-4 text-sm">No video available for this transcript</p>
                                    
                                    <div class="text-sm text-charcoal space-y-1 flex-grow">
                                        <p class="truncate">Created: {{ new Date(transaction.created_at).toLocaleString() }}</p>
                                        <p v-if="transaction.duration" class="truncate">Duration: {{ formatDuration(transaction.duration) }}</p>
                                        <p v-if="transaction.file_size" class="truncate">File Size: {{ formatFileSize(transaction.file_size) }}</p>
                                    </div>
                                    
                                    <div class="mt-4 flex justify-end gap-2 w-full font-poppins flex-shrink-0">
                                        <button
                                            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all duration-150 ease-in cursor-pointer"
                                            @click="promptDelete(transaction)"
                                        >Delete</button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Empty state -->
                            <div v-if="filteredTransactions.length === 0" 
                                 class="flex flex-col items-center justify-center h-64 text-gray-500">
                                <p class="text-lg font-medium">No videos found</p>
                                <p class="text-sm">Try adjusting your filters</p>
                            </div>
                        </div>
    
                        <!-- Pagination Controls -->
                        <div v-if="itemsPerPage !== 'all' && totalPages > 1" 
                             class="flex-shrink-0 px-4 py-4 bg-gray-50 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <!-- Previous Button -->
                                <button
                                    @click="goToPage(currentPage - 1)"
                                    :disabled="currentPage === 1"
                                    :class="[
                                        'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                                        currentPage === 1 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                                    ]"
                                >
                                    Previous
                                </button>
    
                                <!-- Page Numbers -->
                                <div class="flex items-center space-x-1">
                                    <!-- First page -->
                                    <button
                                        v-if="startPage > 1"
                                        @click="goToPage(1)"
                                        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-150"
                                    >
                                        1
                                    </button>
                                    
                                    <!-- Ellipsis -->
                                    <span v-if="startPage > 2" class="px-2 py-2 text-gray-500">...</span>
                                    
                                    <!-- Page range -->
                                    <button
                                        v-for="page in pageRange"
                                        :key="page"
                                        @click="goToPage(page)"
                                        :class="[
                                            'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer',
                                            page === currentPage
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        ]"
                                    >
                                        {{ page }}
                                    </button>
                                    
                                    <!-- Ellipsis -->
                                    <span v-if="endPage < totalPages - 1" class="px-2 py-2 text-gray-500">...</span>
                                    
                                    <!-- Last page -->
                                    <button
                                        v-if="endPage < totalPages"
                                        @click="goToPage(totalPages)"
                                        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-150"
                                    >
                                        {{ totalPages }}
                                    </button>
                                </div>
    
                                <!-- Next Button -->
                                <button
                                    @click="goToPage(currentPage + 1)"
                                    :disabled="currentPage === totalPages"
                                    :class="[
                                        'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                                        currentPage === totalPages 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                                    ]"
                                >
                                    Next
                                </button>
                            </div>
    
                            <!-- Quick Jump -->
                            <div class="flex items-center justify-center mt-4 gap-2">
                                <span class="text-sm text-gray-600 font-poppins">Go to page:</span>
                                <input
                                    v-model.number="jumpToPageInput"
                                    @keyup.enter="jumpToPage"
                                    type="number"
                                    :min="1"
                                    :max="totalPages"
                                    class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                                    placeholder="1"
                                >
                                <button
                                    @click="jumpToPage"
                                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-150 cursor-pointer"
                                >
                                    Go
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!-- Edit Profile Modal -->
<ConfirmModal
  v-if="showEditProfileModal"
  :title="'Edit Profile'"
  :message="'Update your account details below.'"
  icon="user"
  confirm-text="Save"
  cancel-text="Cancel"
  :show-footer="true"
  @confirm="saveProfile"
  @cancel="closeEditProfileModal"
  @close="closeEditProfileModal"
>
  <template #body>
    <div class="space-y-3">
      <div>
        <label class="block text-xs mb-1 text-black">Username</label>
        <input v-model="editProfileForm.username" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Name</label>
        <input v-model="editProfileForm.name" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Surname</label>
        <input v-model="editProfileForm.surname" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div class="pt-2">
        <button
          @click="showPasswordFields = !showPasswordFields"
          class="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
        >
          {{ showPasswordFields ? "Cancel Password Change" : "Change Password" }}
        </button>
      </div>
      <div v-if="showPasswordFields" class="border-t border-gray-700 pt-3 mt-3 space-y-2">
        <div>
          <label class="block text-xs mb-1 text-black">Current Password</label>
          <input v-model="passwordForm.current" type="password" autocomplete="current-password"
            class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
        </div>
        <div>
          <label class="block text-xs mb-1 text-black">New Password</label>
          <input v-model="passwordForm.new" type="password" autocomplete="new-password"
            class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
        </div>
        <div>
          <label class="block text-xs mb-1 text-black">Confirm New Password</label>
          <input v-model="passwordForm.confirm" type="password" autocomplete="new-password"
            class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
        </div>
        <button
          @click="changePassword"
          :disabled="passwordLoading"
          class="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {{ passwordLoading ? "Saving..." : "Save Password" }}
        </button>
        <div class="pt-1">
        </div>
      </div>
      <div class="pt-2">
      </div>
    </div>
  </template>
</ConfirmModal>
<!-- Transaction Delete confirmation modal -->
<ConfirmModal
    v-if="showDeleteModal"
    :title="'Delete Transcript'"
    :message="`Are you sure you want to delete '${transactionToDelete?.original_filename}'? This action cannot be undone.`"
    icon="warning"
    confirm-text="Delete"
    confirm-variant="danger"
    cancel-text="Cancel"
    :show-footer="true"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    @close="cancelDelete"
>
    <template #body>
    <p v-if="deleteLoading" class="text-gray-500">Deleting...</p>
    </template>
</ConfirmModal>
<ProfileModal v-if="showProfileDetails"/>
<MessageDisplay />
</template>

<style>
    .dashboard{
        background: #F7F5EB;
        background: -webkit-linear-gradient(320deg,  rgb(234, 228, 233) 35%, rgba(255, 199, 177, 1) 55%, rgba(247, 245, 235, 1) 100%);
        background: -moz-linear-gradient(320deg,  rgb(234, 228, 233) 35%, rgba(255, 199, 177, 1) 55%, rgba(247, 245, 235, 1) 100%);
        background: linear-gradient(320deg,  rgb(234, 228, 233) 35%, rgba(255, 199, 177, 1) 55%, rgba(247, 245, 235, 1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#F7F5EB", endColorstr="#F7F5EB", GradientType=0);
    }

    .del_btn{
        background: var(--color-rust-1);
        cursor: pointer;
    }
    .del_btn:hover{
        background: var(--color-rust);
    }
</style>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { useMessageDisplay } from '../composables/useMessageDisplay';
import Albcaptions_logo from './logos/Albcaptions_Logo_inv.vue';
import Time from './items/Time.vue';
import VideoIcon from './items/Video.vue';
import Save from './items/Save.vue';
import ConfirmModal from './items/ModalDialog.vue';
import ProfileModal from './items/ProfileModal.vue';
import MessageDisplay from './items/MessageDisplay.vue';

const router = useRouter();
const { showSuccess, showError, showWarning, showInfo } = useMessageDisplay();
const loading = ref(true);
const transcriptsLoading = ref(true); 
const allUsersLoading = ref(false); 
const userData = ref(null);
const userRoleDetails = ref(null);
const userRoleDetailsLoading = ref(false);
const userTrans = ref([]);
const allUsers = ref([]);

// Search and Filter State
const searchFilename = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const durationMin = ref('');
const durationMax = ref('');
const sortBy = ref('created_at');
const sortOrder = ref('desc');
const showFilters = ref(false);

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref('24'); // Default to 24 items per page
const jumpToPageInput = ref(null);

// Modal state for transaction deletion
const showDeleteModal = ref(false);
const transactionToDelete = ref(null);
const deleteLoading = ref(false);

// Modal state for user deletion
const showDeleteUserModal = ref(false);
const userToDelete = ref(null);
const deleteUserLoading = ref(false);
// Modal state for deactivating account
const showDeactivateModal = ref(false);
const deactivateLoading = ref(false);
// Modal state for subscription cancellation
const showCancelSubscriptionModal = ref(false);
const cancelSubscriptionLoading = ref(false);
const hasActiveSubscription = ref(false);

//Roles states
const roles = ref([]);
const rolesLoading = ref(false);
const showRoleModal = ref(false);
const roleModalLoading = ref(false);
const editingRole = ref(null);

// Modal state for Role creation
const showCreateRoleModal = ref(false);
const createRoleLoading = ref(false);
const newRole = ref({
  name: '',
  price: 0,
  videos_per_month: 0,
  total_aminutes_per_month: 0,
  max_video_duration: 0,
  max_file_size_mb: 0,
  srt_exports_per_month: 0,
  is_admin: false
});
// Modal state for role deletion
const showDeleteRoleModal = ref(false);
const roleToDelete = ref(null);
const deleteRoleLoading = ref(false);

//User update states
const showEditProfileModal = ref(false);
const editProfileForm = ref({
  username: '',
  name: '',
  surname: ''
});
const editProfileLoading = ref(false);

// Password change form state
const showPasswordFields = ref(false);
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});
const passwordLoading = ref(false);

// Computed property for filtered and sorted transactions
const filteredTransactions = computed(() => {
  let filtered = [...userTrans.value];
  
  // Filter by filename
  if (searchFilename.value.trim()) {
    const searchTerm = searchFilename.value.toLowerCase().trim();
    filtered = filtered.filter(transaction => 
      transaction.original_filename?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by date range
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter(transaction => 
      new Date(transaction.created_at) >= fromDate
    );
  }
  
  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999); // Include the entire day
    filtered = filtered.filter(transaction => 
      new Date(transaction.created_at) <= toDate
    );
  }
  
  // Filter by duration range
  if (durationMin.value !== '') {
    const minDuration = parseInt(durationMin.value);
    filtered = filtered.filter(transaction => 
      transaction.duration >= minDuration
    );
  }
  
  if (durationMax.value !== '') {
    const maxDuration = parseInt(durationMax.value);
    filtered = filtered.filter(transaction => 
      transaction.duration <= maxDuration
    );
  }
  
  // Sort transactions
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy.value) {
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'original_filename':
        aValue = a.original_filename?.toLowerCase() || '';
        bValue = b.original_filename?.toLowerCase() || '';
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      case 'file_size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      default:
        return 0;
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
  
  return filtered;
});

// Pagination computed properties
const totalFilteredItems = computed(() => {
  return filteredTransactions.value.length;
});

const totalPages = computed(() => {
  if (itemsPerPage.value === 'all') return 1;
  return Math.ceil(totalFilteredItems.value / parseInt(itemsPerPage.value));
});

const paginatedTransactions = computed(() => {
  if (itemsPerPage.value === 'all') {
    return filteredTransactions.value;
  }
  
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredTransactions.value.slice(start, end);
});

// Pagination display logic
const startPage = computed(() => {
  const maxPagesToShow = 5;
  const halfRange = Math.floor(maxPagesToShow / 2);
  
  if (totalPages.value <= maxPagesToShow) {
    return 1;
  }
  
  if (currentPage.value <= halfRange) {
    return 1;
  }
  
  if (currentPage.value >= totalPages.value - halfRange) {
    return totalPages.value - maxPagesToShow + 1;
  }
  
  return currentPage.value - halfRange;
});

const endPage = computed(() => {
  const maxPagesToShow = 5;
  return Math.min(startPage.value + maxPagesToShow - 1, totalPages.value);
});

const pageRange = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Watch for filter changes to reset pagination
watch([searchFilename, dateFrom, dateTo, durationMin, durationMax, sortBy, sortOrder], () => {
  resetToFirstPage();
});

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    jumpToPageInput.value = null;
    
    // Scroll to top of video grid on next tick
    setTimeout(() => {
      const videoGrid = document.querySelector('.grid');
      if (videoGrid) {
        videoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
};

const jumpToPage = () => {
  if (jumpToPageInput.value && jumpToPageInput.value >= 1 && jumpToPageInput.value <= totalPages.value) {
    goToPage(jumpToPageInput.value);
  }
};

const resetToFirstPage = () => {
  currentPage.value = 1;
  jumpToPageInput.value = null;
};


// Open edit modal and fill form
const promptEditProfile = () => {
  showEditProfileModal.value = true;
  editProfileForm.value = {
    username: userData.value.username || '',
    name: userData.value.name || '',
    surname: userData.value.surname || ''
  };
  showPasswordFields.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
};

const closeEditProfileModal = () => {
  showEditProfileModal.value = false;
};

// Save profile changes
const saveProfile = async () => {
  editProfileLoading.value = true;
  try {
    // Update user fields in your users table
    const { error } = await supabase
      .from('users')
      .update({
        username: editProfileForm.value.username,
        name: editProfileForm.value.name,
        surname: editProfileForm.value.surname
      })
      .eq('id', userData.value.id);
    if (error) throw error;
    
    showSuccess('Profile updated successfully!');
    // Optionally update local userData
    userData.value.username = editProfileForm.value.username;
    userData.value.name = editProfileForm.value.name;
    userData.value.surname = editProfileForm.value.surname;
    setTimeout(() => {
      showEditProfileModal.value = false;
    }, 1200);
  } catch (err) {
    showError(err.message || 'Failed to update profile.');
  } finally {
    editProfileLoading.value = false;
  }
};

// Password change logic
const changePassword = async () => {
  passwordLoading.value = true;
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    showError('All password fields are required.');
    passwordLoading.value = false;
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    showError('New password and confirmation do not match.');
    passwordLoading.value = false;
    return;
  }
  try {
    // Reauthenticate user (Supabase requires current session, but not password verification, so do it via signInWithPassword)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.value.email,
      password: passwordForm.value.current
    });
    if (signInError) {
      showError('Current password is incorrect.');
      passwordLoading.value = false;
      return;
    }
    // Update password
    const { error: pwdError } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    });
    if (pwdError) {
      showError(pwdError.message || 'Failed to update password.');
    } else {
      showSuccess('Password updated successfully!');
      passwordForm.value = { current: '', new: '', confirm: '' };
      setTimeout(() => {
        showPasswordFields.value = false;
      }, 1200);
    }
  } catch (err) {
    showError(err.message || 'Failed to update password.');
  } finally {
    passwordLoading.value = false;
  }
};

const goToDetails = (id) => {
  router.push(`/transaction/${id}`);
};

// Helper function to format duration
const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Clear all filters
const clearFilters = () => {
  searchFilename.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  durationMin.value = '';
  durationMax.value = '';
  sortBy.value = 'created_at';
  sortOrder.value = 'desc';
};

// Set date presets
const setDatePreset = (days) => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);
  
  dateFrom.value = pastDate.toISOString().split('T')[0];
  dateTo.value = today.toISOString().split('T')[0];
};

// Function to load user data with debugging
const loadUserData = async () => {
  loading.value = true;

  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      showError("Error retrieving session");
      return;
    }

    if (!session) {
      showError("No active session found");
      return;
    }

    const user = session.user;

    // Fetch user data with role information using a join
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select(`
        *,
        roles!users_role_fkey (
          id,
          name,
          price,
          videos_per_month,
          total_minutes_per_month,
          max_video_duration,
          max_file_size_mb,
          srt_exports_per_month,
          is_admin
        )
      `)
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      showError("User profile not found in the database.");
      userData.value = null;
      return;
    }

    // Check for all required fields
    if (!dbUser.name || !dbUser.surname || !dbUser.username || !dbUser.role) {
      showError("Incomplete user profile data. Please contact support.");
      userData.value = null;
      return;
    }

    userData.value = {
      ...dbUser,
      email: user.email, // if you want to keep email from Auth, else use dbUser.email
      roleName: dbUser.roles?.name || 'Unknown Role' // Extract role name for easy access
    };

    // Optionally log or handle successful load
    console.log("User data loaded successfully:", userData.value);

  } catch (error) {
    showError(error.message);
    userData.value = null;
  } finally {
    loading.value = false;
  }
};

// Function to load user role details
const getUserRoleDetails = async () => {
  userRoleDetailsLoading.value = true;
  try {
    if (!userData.value?.id) return;
    const { data, error } = await supabase
      .from('user_role_details')
      .select('*')
      .eq('id', userData.value.id)
      .single();
    if (error) throw error;
    userRoleDetails.value = data;
  } catch (error) {
    showError(error.message || 'Failed to fetch user role details.');
    userRoleDetails.value = null;
  } finally {
    userRoleDetailsLoading.value = false;
  }
};

//Function to load all roles (admin only)
const getAllRoles = async () => {
  rolesLoading.value = true;
  try {
    const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    roles.value = data || [];
  } catch (error) {
    roles.value = [];
  } finally {
    rolesLoading.value = false;
  }
};

// Open modal for editing a role
const openRoleModal = (role) => {
  editingRole.value = { ...role }; // clone to avoid direct mutation
  showRoleModal.value = true;
};

const closeRoleModal = () => {
  editingRole.value = null;
  showRoleModal.value = false;
};

// Save changes to a role
const saveRole = async () => {
  if (!editingRole.value) return;
  roleModalLoading.value = true;
  try {
    // Prepare update object, exclude id and created_at
    const updateData = { ...editingRole.value };
    delete updateData.id;
    delete updateData.created_at;
    // Update updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase.from('roles')
      .update(updateData)
      .eq('id', editingRole.value.id);
    if (error) throw error;

    // Refresh roles in UI
    await getAllRoles();
    closeRoleModal();
    showSuccess(`Role '${editingRole.value.name}' updated successfully.`);
  } catch (err) {
    showError(err.message || 'Failed to update role.');
  } finally {
    roleModalLoading.value = false;
  }
};

// NEW: Functions for creating a new role
const openCreateRoleModal = () => {
  newRole.value = {
    name: '',
    price: 0,
    videos_per_month: 0,
    total_minutes_per_month: 0,
    max_video_duration: 0,
    max_file_size_mb: 0,
    srt_exports_per_month: 0,
    is_admin: false
  };
  showCreateRoleModal.value = true;
};

const closeCreateRoleModal = () => {
  showCreateRoleModal.value = false;
};

const createRole = async () => {
  createRoleLoading.value = true;
  
  try {
    // Validate required fields
    if (!newRole.value.name.trim()) {
      showError('Role name is required.');
      createRoleLoading.value = false;
      return;
    }

    // Prepare insert data
    const insertData = {
      ...newRole.value,
      name: newRole.value.name.trim(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('roles')
      .insert([insertData]);
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        showError('A role with this name already exists.');
      } else {
        throw error;
      }
      return;
    }

    // Refresh roles in UI
    await getAllRoles();
    closeCreateRoleModal();
    showSuccess(`Role '${newRole.value.name}' created successfully.`);
  } catch (err) {
    showError(err.message || 'Failed to create role.');
  } finally {
    createRoleLoading.value = false;
  }
};

// Role deletion logic
const promptDeleteRole = (role) => {
  // Optional: Add validation to prevent deleting roles that are in use
  // You might want to check if any users are assigned to this role
  roleToDelete.value = role;
  showDeleteRoleModal.value = true;
  deleteRoleError.value = null;
};

const confirmDeleteRole = async () => {
  if (!roleToDelete.value) return;
  deleteRoleLoading.value = true;
  deleteRoleError.value = null;
  
  try {
    // Optional: Check if role is in use before deletion
    const { data: usersWithRole, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('role', roleToDelete.value.id)
      .limit(1);
    
    if (checkError) {
      deleteRoleError.value = 'Error checking role usage.';
      return;
    }
    
    if (usersWithRole && usersWithRole.length > 0) {
      deleteRoleError.value = 'Cannot delete role: it is currently assigned to users.';
      return;
    }

    // Delete role from the roles table
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleToDelete.value.id);
    
    if (error) {
      deleteRoleError.value = error.message || 'Failed to delete role.';
    } else {
      // Remove from local list
      roles.value = roles.value.filter(r => r.id !== roleToDelete.value.id);
      showDeleteRoleModal.value = false;
      roleToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = `Role '${roleToDelete.value.name}' deleted successfully.`;
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    deleteRoleError.value = err.message || 'Failed to delete role.';
  } finally {
    deleteRoleLoading.value = false;
  }
};

const cancelDeleteRole = () => {
  showDeleteRoleModal.value = false;
  roleToDelete.value = null;
  deleteRoleError.value = null;
};

// Function to get user transcripts
async function getTranscripts() {
  transcriptsLoading.value = true;
  try {
    if (!userData.value?.id) {
      return;
    }

    // Fetch transactions with video_url from the related videos table
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        videos (id, video_url)
      `)
      .eq('user_id', userData.value.id)
      .order('created_at', { ascending: false });
    if (error) {
      return;
    }
    
    userTrans.value = data.map(transaction => ({
      ...transaction,
      video_url: transaction.videos?.video_url || null,
    }));
  } catch (error) {
  } finally {
    transcriptsLoading.value = false;
  }
}

// Updated function to get all users from your custom users table (excluding current user)
async function getAllUsers() {
  if (userData.value?.role !== 'd61d7768-a279-420b-a0ce-b65483794329') {
    return;
  }
  
  allUsersLoading.value = true;
  try {
    // Query your custom users table, excluding the current user
    const { data, error } = await supabase
      .from('users')
      .select(`*,
        roles (
          name
          )
        `) 
      .neq('id', userData.value.id) // Exclude current user by ID
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    allUsers.value = data || [];
    
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    allUsersLoading.value = false;
  }
}

// Helper function to check if user is admin
const isAdmin = () => {
  return userData.value?.role === 'd61d7768-a279-420b-a0ce-b65483794329';
};

// Helper function to check if a user can be deleted (not admin)
const canDeleteUser = (user) => {
  return user.role !== 'd61d7768-a279-420b-a0ce-b65483794329';
};

// User deletion logic
const promptDeleteUser = (user) => {
  if (!canDeleteUser(user)) {
    return; // Safety check
  }
  userToDelete.value = user;
  showDeleteUserModal.value = true;
  deleteUserError.value = null;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return;
  deleteUserLoading.value = true;
  deleteUserError.value = null;
  
  try {
    // Delete user from the users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.value.id);
    
    if (error) {
      deleteUserError.value = error.message || 'Failed to delete user.';
    } else {
      // Remove from local list
      allUsers.value = allUsers.value.filter(u => u.id !== userToDelete.value.id);
      showDeleteUserModal.value = false;
      userToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = 'User deleted successfully.';
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    deleteUserError.value = err.message || 'Failed to delete user.';
  } finally {
    deleteUserLoading.value = false;
  }
};

const cancelDeleteUser = () => {
  showDeleteUserModal.value = false;
  userToDelete.value = null;
  deleteUserError.value = null;
};

// Deactivate account logic
const promptDeactivate = () => {
  showDeactivateModal.value = true;
  deactivateError.value = null;
};

const confirmDeactivate = async () => {
  deactivateLoading.value = true;
  deactivateError.value = null;
  try {
    // Delete from custom users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userData.value.id);

    if (error) {
      deactivateError.value = error.message || 'Failed to deactivate account.';
      return;
    }

    // Optionally sign user out (recommended)
    await supabase.auth.signOut();

    // Redirect to home or goodbye page
    router.push('/');

  } catch (err) {
    deactivateError.value = err.message || 'Failed to deactivate account.';
  } finally {
    deactivateLoading.value = false;
  }
};

const cancelDeactivate = () => {
  showDeactivateModal.value = false;
  deactivateError.value = null;
};

// Transaction deletion logic
const promptDelete = (transaction) => {
  transactionToDelete.value = transaction;
  showDeleteModal.value = true;
  deleteError.value = null;
};

const confirmDelete = async () => {
  if (!transactionToDelete.value) return;
  
  const transactionId = transactionToDelete.value.id;
  const videoUrl = transactionToDelete.value.video_url;
  
  deleteLoading.value = true;
  deleteError.value = null;
  
  try {
    if (videoUrl) {
      const url = new URL(videoUrl);
      const pathParts = url.pathname.split('/');
      const videosIndex = pathParts.findIndex(part => part === 'videos');
      
      if (videosIndex > -1 && videosIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(videosIndex + 1).join('/');
        console.log('Attempting to delete file path:', filePath);
        console.log('Original video URL:', videoUrl);
        console.log('URL pathname:', url.pathname);
        console.log('Path parts:', pathParts);
        console.log('Videos index:', videosIndex);
        
        // Fixed: Use correct destructuring - 'data' and 'error', not 'BucketData' and 'BucketError'
        const { data, error: storageError } = await supabase
          .storage
          .from('videos')
          .remove([filePath]);

        if (storageError) {
          console.error('Failed to delete video file from storage:', storageError);
          // You might want to decide whether to continue with DB deletion or not
          deleteError.value = `Failed to delete video file: ${storageError.message}`;
          return; // Stop here if storage deletion fails
        } else {
          console.log('Video file deleted from storage successfully:', data);
        }
      }
    }

    // Delete the transaction from database (this will cascade to related tables including videos)
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
      
    if (error) {
      deleteError.value = error.message || 'Failed to delete transaction.';
    } else {
      // Remove from local list using the stored transaction ID
      userTrans.value = userTrans.value.filter(t => t.id !== transactionId);
      showDeleteModal.value = false;
      transactionToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = 'Transaction and video deleted successfully.';
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 2500);
    }
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete transaction.';
    console.error('Delete operation failed:', err);
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  transactionToDelete.value = null;
  deleteError.value = null;
};

const checkActiveSubscription = async () => {
  if (!userData.value?.id) return;
  
  try {
    const { data, error } = await supabase
      .from('paypal_subscriptions')
      .select('paypal_subscription_id')
      .eq('user_id', userData.value.id)
      .single();
    
    hasActiveSubscription.value = !error && data;
  } catch (err) {
    hasActiveSubscription.value = false;
  }
};

const promptCancelSubscription = () => {
  showCancelSubscriptionModal.value = true;
  cancelSubscriptionError.value = null;
};

const confirmCancelSubscription = async () => {
  cancelSubscriptionLoading.value = true;
  cancelSubscriptionError.value = null;
  
  try {
    const response = await fetch('https://96b5-31-22-56-9.ngrok-free.app/api/paypal/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userData.value.id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      cancelSubscriptionError.value = result.error || 'Failed to cancel subscription';
      return;
    }

    hasActiveSubscription.value = false;
    showCancelSubscriptionModal.value = false;
    
    await loadUserData();
    
    showSuccessAlert.value = true;
    successAlertMessage.value = 'Subscription cancelled successfully. You have been downgraded to the free plan.';
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 5000);

  } catch (err) {
    cancelSubscriptionError.value = err.message || 'Failed to cancel subscription';
  } finally {
    cancelSubscriptionLoading.value = false;
  }
};

const cancelCancelSubscription = () => {
  showCancelSubscriptionModal.value = false;
  cancelSubscriptionError.value = null;
};

const handleSignOut = async () => {
  await supabase.auth.signOut();
};

onMounted(async () => {
  await loadUserData();
  if (userData.value) {
    await getUserRoleDetails();
    getTranscripts();
    await checkActiveSubscription();
    if (isAdmin()) {
      await getAllUsers();
      await getAllRoles();
    }
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      loadUserData().then(async () => {
        if (userData.value) {
          await getUserRoleDetails();
          getTranscripts();
          if (isAdmin()) {
            getAllUsers();
          }
        }
      });
    } else if (event === 'SIGNED_OUT') {
      userData.value = null;
      userTrans.value = [];
      allUsers.value = [];
      userRoleDetails.value = null;
      router.push('/');
    }
  });
});
</script>