<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import ConfirmModal from './items/ModalDialog.vue';

const router = useRouter();
const loading = ref(true);
const transcriptsLoading = ref(true); 
const allUsersLoading = ref(false); 
const userData = ref(null);
const authError = ref(null);
const userTrans = ref([]);
const allUsers = ref([]); 
const showSuccessAlert = ref(false);
const successAlertMessage = ref('');

// Search and Filter State
const searchFilename = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const durationMin = ref('');
const durationMax = ref('');
const sortBy = ref('created_at');
const sortOrder = ref('desc');
const showFilters = ref(false);

// Modal state for transaction deletion
const showDeleteModal = ref(false);
const transactionToDelete = ref(null);
const deleteLoading = ref(false);
const deleteError = ref(null);

// Modal state for user deletion
const showDeleteUserModal = ref(false);
const userToDelete = ref(null);
const deleteUserLoading = ref(false);
const deleteUserError = ref(null);
// Modal state for deactivating account
const showDeactivateModal = ref(false);
const deactivateLoading = ref(false);
const deactivateError = ref(null);

//Roles states
const roles = ref([]);
const rolesLoading = ref(false);
const showRoleModal = ref(false);
const roleModalLoading = ref(false);
const roleModalError = ref(null);
const editingRole = ref(null);

// Modal state for Role creation
const showCreateRoleModal = ref(false);
const createRoleLoading = ref(false);
const createRoleError = ref(null);
const newRole = ref({
  name: '',
  price: 0,
  videos_per_month: 0,
  total_minutes_per_month: 0,
  max_video_duration: 0,
  max_file_size_mb: 0,
  srt_exports_per_month: 0,
  is_admin: false
});
// Modal state for role deletion
const showDeleteRoleModal = ref(false);
const roleToDelete = ref(null);
const deleteRoleLoading = ref(false);
const deleteRoleError = ref(null);

//User update states
const showEditProfileModal = ref(false);
const editProfileForm = ref({
  username: '',
  name: '',
  surname: ''
});
const editProfileLoading = ref(false);
const editProfileError = ref(null);
const editProfileSuccess = ref(null);

// Password change form state
const showPasswordFields = ref(false);
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});
const passwordError = ref(null);
const passwordLoading = ref(false);
const passwordSuccess = ref(null);

// Open edit modal and fill form
const promptEditProfile = () => {
  showEditProfileModal.value = true;
  editProfileForm.value = {
    username: userData.value.username || '',
    name: userData.value.name || '',
    surname: userData.value.surname || ''
  };
  editProfileError.value = null;
  editProfileSuccess.value = null;
  showPasswordFields.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
  passwordError.value = null;
};

const closeEditProfileModal = () => {
  showEditProfileModal.value = false;
};

// Save profile changes
const saveProfile = async () => {
  editProfileLoading.value = true;
  editProfileError.value = null;
  editProfileSuccess.value = null;
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
    editProfileSuccess.value = 'Profile updated!';
    // Optionally update local userData
    userData.value.username = editProfileForm.value.username;
    userData.value.name = editProfileForm.value.name;
    userData.value.surname = editProfileForm.value.surname;
    setTimeout(() => {
      showEditProfileModal.value = false;
      editProfileSuccess.value = null;
    }, 1200);
  } catch (err) {
    editProfileError.value = err.message || 'Failed to update profile.';
  } finally {
    editProfileLoading.value = false;
  }
};

// Password change logic
const changePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = null;
  passwordSuccess.value = null;
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    passwordError.value = 'All password fields are required.';
    passwordLoading.value = false;
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordError.value = 'New password and confirmation do not match.';
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
      passwordError.value = 'Current password is incorrect.';
      passwordLoading.value = false;
      return;
    }
    // Update password
    const { error: pwdError } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    });
    if (pwdError) {
      passwordError.value = pwdError.message || 'Failed to update password.';
    } else {
      passwordSuccess.value = 'Password updated!';
      passwordForm.value = { current: '', new: '', confirm: '' };
      setTimeout(() => {
        showPasswordFields.value = false;
        passwordSuccess.value = null;
      }, 1200);
    }
  } catch (err) {
    passwordError.value = err.message || 'Failed to update password.';
  } finally {
    passwordLoading.value = false;
  }
};

const goToDetails = (id) => {
  router.push(`/transaction/${id}`);
};

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
  authError.value = null;

  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      authError.value = "Error retrieving session";
      return;
    }

    if (!session) {
      authError.value = "No active session found";
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
      authError.value = "User profile not found in the database.";
      userData.value = null;
      return;
    }

    // Check for all required fields
    if (!dbUser.name || !dbUser.surname || !dbUser.username || !dbUser.role) {
      authError.value = "Incomplete user profile data. Please contact support.";
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
    authError.value = error.message;
    userData.value = null;
  } finally {
    loading.value = false;
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
  roleModalError.value = null;
};

const closeRoleModal = () => {
  editingRole.value = null;
  showRoleModal.value = false;
  roleModalError.value = null;
};

// Save changes to a role
const saveRole = async () => {
  if (!editingRole.value) return;
  roleModalLoading.value = true;
  roleModalError.value = null;
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
    showSuccessAlert.value = true;
    successAlertMessage.value = `Role '${editingRole.value.name}' updated successfully.`;
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 2500);
  } catch (err) {
    roleModalError.value = err.message || 'Failed to update role.';
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
  createRoleError.value = null;
};

const closeCreateRoleModal = () => {
  showCreateRoleModal.value = false;
  createRoleError.value = null;
};

const createRole = async () => {
  createRoleLoading.value = true;
  createRoleError.value = null;
  
  try {
    // Validate required fields
    if (!newRole.value.name.trim()) {
      createRoleError.value = 'Role name is required.';
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
        createRoleError.value = 'A role with this name already exists.';
      } else {
        throw error;
      }
      return;
    }

    // Refresh roles in UI
    await getAllRoles();
    closeCreateRoleModal();
    showSuccessAlert.value = true;
    successAlertMessage.value = `Role '${newRole.value.name}' created successfully.`;
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 2500);
  } catch (err) {
    createRoleError.value = err.message || 'Failed to create role.';
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
      roles.value = roles.value.filter(r => r && r.id !== roleToDelete.value.id);
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
      allUsers.value = allUsers.value.filter(u => u && u.id !== userToDelete.value.id);
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

// Helper function to extract file path from Supabase storage URL
const extractFilePathFromUrl = (videoUrl) => {
  if (!videoUrl) return null;
  try {
    // Handle different Supabase storage URL formats:
    // Public: https://<project>.supabase.co/storage/v1/object/public/videos/<file-path>
    // Signed: https://<project>.supabase.co/storage/v1/object/sign/videos/<file-path>?token=...
    const url = new URL(videoUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the 'videos' bucket in the path
    const videosIndex = pathParts.indexOf('videos');
    if (videosIndex !== -1 && videosIndex < pathParts.length - 1) {
      // Return everything after 'videos/' in the path
      return pathParts.slice(videosIndex + 1).join('/');
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to extract file path from video URL:', error);
    return null;
  }
};

const confirmDelete = async () => {
  if (!transactionToDelete.value) return;
  deleteLoading.value = true;
  deleteError.value = null;
  
  let videoDeleted = false;
  
  try {
    // First, fetch the transaction with video information to get the video URL
    const { data: transactionData, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        videos (id, video_url)
      `)
      .eq('id', transactionToDelete.value.id)
      .single();
    
    if (fetchError) {
      deleteError.value = fetchError.message || 'Failed to fetch transaction details.';
      return;
    }

    // If there's an associated video, try to delete it from storage first
    if (transactionData.videos?.video_url) {
      const filePath = extractFilePathFromUrl(transactionData.videos.video_url);
      
      if (filePath) {
        try {
          const { error: storageError } = await supabase.storage
            .from('videos')
            .remove([filePath]);
          
          if (storageError) {
            console.warn('Failed to delete video file from storage:', storageError);
            // Continue with transaction deletion even if storage deletion fails
            // This prevents orphaned database records if the video file was already deleted
          } else {
            videoDeleted = true;
          }
        } catch (storageErr) {
          console.warn('Error deleting video file:', storageErr);
          // Continue with transaction deletion
        }
      }
    }

    // Now delete the transaction (this will cascade to related tables)
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionToDelete.value.id);
      
    if (error) {
      deleteError.value = error.message || 'Failed to delete transaction.';
    } else {
      // Remove from local list
      userTrans.value = userTrans.value.filter(t => t && t.id !== transactionToDelete.value.id);
      showDeleteModal.value = false;
      transactionToDelete.value = null;
      showSuccessAlert.value = true;
      
      // Provide contextual success message
      if (videoDeleted) {
        successAlertMessage.value = 'Transcript and associated video deleted successfully.';
      } else {
        successAlertMessage.value = 'Transcript deleted successfully.';
      }
      
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 2500);
    }
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete transaction.';
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  transactionToDelete.value = null;
  deleteError.value = null;
};

onMounted(async () => {
  await loadUserData();
  if (userData.value) {
    getTranscripts();
    if (isAdmin()) {
      await getAllUsers();
      await getAllRoles(); 
    }
  }
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      loadUserData().then(() => {
        if (userData.value) {
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
      router.push('/');
    }
  });
});

</script>
<template>
  
  <div class="min-h-screen bg-[#0f172a] text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="showSuccessAlert" class="mb-4 bg-green-500 text-white px-4 py-3 rounded shadow fixed flex justify-center z-50">
        {{ successAlertMessage }}
      </div>
      <!-- Only show full loading for initial auth check -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a784ffd4]"></div>
      </div>
      
      <div v-else-if="userData" class="bg-gray-800 bg-opacity-40 rounded-xl p-8">
        <h1 class="text-4xl font-bold mb-6">Dashboard</h1>
        
        <div class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Welcome, {{ userData?.name }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-[#92a3bb] mb-1">Username:</p>
              <p class="font-medium">{{ userData?.username }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Email:</p>
              <p class="font-medium">{{ userData?.email }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Full Name:</p>
              <p class="font-medium">{{ userData?.name }} {{ userData?.surname }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Account Type:</p>
              <p class="font-medium capitalize">{{ userData.roleName }}</p>
            </div>
            <button
  @click="promptEditProfile"
  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mb-4 mr-2"
>
  Edit Profile
</button>
          </div>
          <div class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8 mt-8">
            <h2 class="text-xl font-semibold mb-3 text-red-400">Deactivate Account</h2>
            <p class="text-[#92a3bb] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              @click="promptDeactivate"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Deactivate Account
            </button>
          </div>
        </div>

        <!-- Admin Section - Only visible to admin users -->
        <div v-if="isAdmin()" class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#a784ffd4]">👤 Admin Panel - User Management</h2>
          
          <!-- Refresh button for admin -->
          <div class="mb-4">
            <button 
              @click="getAllUsers" 
              :disabled="allUsersLoading"
              class="px-4 py-2 bg-[#a784ffd4] hover:bg-[#9370db] disabled:opacity-50 text-white rounded-lg text-sm"
            >
              {{ allUsersLoading ? 'Loading...' : 'Refresh Users' }}
            </button>
          </div>
          
          <!-- Loading state for users -->
          <div v-if="allUsersLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a784ffd4]"></div>
          </div>
          
          <!-- Users list -->
          <div v-else-if="allUsers.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-600">
                  <th class="py-3 px-4 text-[#92a3bb]">Full Name</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Email</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Username</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Role</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Created</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Last Updated</th>
                  <th class="py-3 px-4 text-[#92a3bb]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in allUsers" :key="user.id" class="border-b border-gray-700 hover:bg-gray-600 hover:bg-opacity-30">
                  <td class="py-3 px-4">{{ user.name }} {{ user.surname }}</td>
                  <td class="py-3 px-4">{{ user.email }}</td>
                  <td class="py-3 px-4">{{ user.username }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded text-sm" :class="{
                      'bg-purple-600 text-white': user.roles?.name === 'admin',
                      'bg-blue-600 text-white': user.roles?.name === 'pro',
                      'bg-green-600 text-white': user.roles?.name === 'business',
                      'bg-yellow-600 text-white': user.roles?.name === 'starter',
                      'bg-gray-600 text-white': user.roles?.name === 'free'
                    }">
                      {{ user.roles?.name }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-[#92a3bb]">
                    {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' }}
                  </td>
                  <td class="py-3 px-4 text-sm text-[#92a3bb]">
                    {{ user.last_updated_at ? new Date(user.last_updated_at).toLocaleDateString() : 'N/A' }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <!-- Delete button - only for non-admin users -->
                      <button
                        v-if="canDeleteUser(user)"
                        @click="promptDeleteUser(user)"
                        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        title="Delete User"
                      >
                        Delete
                      </button>
                      <!-- Protected admin indicator -->
                      <span 
                        v-else 
                        class="px-3 py-1 bg-gray-500 text-gray-300 rounded text-sm cursor-not-allowed"
                        title="Admin users cannot be deleted"
                      >
                        Protected
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-4 text-sm text-[#92a3bb]">
              Total other users: {{ allUsers.length }}
              <span v-if="allUsers.length === 0" class="ml-2">(You are the only user)</span>
            </div>
          </div>
          
          <!-- No users message -->
          <div v-else class="text-center py-8">
            <p class="text-[#92a3bb]">No other users found in the database.</p>
            <p class="text-sm text-[#92a3bb] mt-2">You are currently the only user.</p>
          </div>
          <div v-if="isAdmin()" class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8 mt-8">
            <h2 class="text-2xl font-semibold mb-4 text-[#a784ffd4]">🛠️ Admin Panel - Role Management</h2>
            <!-- Button to create new role -->
            <div class="mb-4">
              <button 
                @click="openCreateRoleModal" 
                class="px-4 py-2 bg-[#a784ffd4] hover:bg-[#9370db] text-white rounded-lg text-sm"
              >
                Create New Role
              </button>
            </div>
            <!-- Refresh button for roles -->
            <div class="mb-4">
              <button 
                @click="getAllRoles" 
                :disabled="rolesLoading"
                class="px-4 py-2 bg-[#a784ffd4] hover:bg-[#9370db] disabled:opacity-50 text-white rounded-lg text-sm"
              >
                {{ rolesLoading ? 'Loading...' : 'Refresh Roles' }}
              </button>
            </div>
            <div v-if="rolesLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a784ffd4]"></div>
            </div>
            <div v-else-if="roles.length > 0" class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-gray-600">
                    <th class="py-2 px-3">Role Name</th>
                    <th class="py-2 px-3">Price</th>
                    <th class="py-2 px-3">Videos/Month</th>
                    <th class="py-2 px-3">Minutes/Month</th>
                    <th class="py-2 px-3">Max Duration</th>
                    <th class="py-2 px-3">Max File Size (MB)</th>
                    <th class="py-2 px-3">SRT Exports/Month</th>
                    <th class="py-2 px-3">Admin?</th>
                    <th class="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="role in roles" :key="role.id" class="border-b border-gray-700 hover:bg-gray-600 hover:bg-opacity-30">
                    <td class="py-2 px-3 font-bold">{{ role.name }}</td>
                    <td class="py-2 px-3">{{ role.price }}</td>
                    <td class="py-2 px-3">{{ role.videos_per_month }}</td>
                    <td class="py-2 px-3">{{ role.total_minutes_per_month }}</td>
                    <td class="py-2 px-3">{{ role.max_video_duration }}</td>
                    <td class="py-2 px-3">{{ role.max_file_size_mb }}</td>
                    <td class="py-2 px-3">{{ role.srt_exports_per_month ?? 'N/A' }}</td>
                    <td class="py-2 px-3">
                      <span :class="role.is_admin ? 'text-green-400' : 'text-gray-400'">
                        {{ role.is_admin ? 'Yes' : 'No' }}
                      </span>
                    </td>
                    <td class="py-2 px-3">
                      <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                        @click="openRoleModal(role)">
                        Edit
                      </button>
                    </td>
                    <td class="py-2 px-3">
                      <button 
                        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs ml-2"
                        @click="promptDeleteRole(role)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-[#92a3bb]">
              No roles found.
            </div>
          </div>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Your Transcripts</h2>
            <button 
              @click="showFilters = !showFilters"
              class="px-4 py-2 bg-[#a784ffd4] hover:bg-[#9370db] text-white rounded-lg text-sm flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
              </svg>
              {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
            </button>
          </div>

          <!-- Filter Panel -->
          <div v-if="showFilters" class="bg-gray-600 bg-opacity-40 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <!-- Filename Search -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">Search by Filename</label>
                <input
                  v-model="searchFilename"
                  type="text"
                  placeholder="Enter filename..."
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                />
              </div>

              <!-- Date From -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">From Date</label>
                <input
                  v-model="dateFrom"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                />
              </div>

              <!-- Date To -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">To Date</label>
                <input
                  v-model="dateTo"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                />
              </div>

              <!-- Duration Min -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">Min Duration (seconds)</label>
                <input
                  v-model="durationMin"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                />
              </div>

              <!-- Duration Max -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">Max Duration (seconds)</label>
                <input
                  v-model="durationMax"
                  type="number"
                  min="0"
                  placeholder="999999"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                />
              </div>

              <!-- Sort By -->
              <div>
                <label class="block text-sm font-medium text-[#92a3bb] mb-2">Sort By</label>
                <select
                  v-model="sortBy"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent"
                >
                  <option value="created_at">Date Created</option>
                  <option value="original_filename">Filename</option>
                  <option value="duration">Duration</option>
                  <option value="file_size">File Size</option>
                </select>
              </div>
            </div>

            <!-- Sort Order and Date Presets -->
            <div class="flex flex-wrap gap-2 mb-4">
              <!-- Sort Order -->
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-[#92a3bb]">Order:</label>
                <select
                  v-model="sortOrder"
                  class="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a784ffd4]"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              <!-- Date Presets -->
              <div class="flex items-center gap-2 ml-4">
                <span class="text-sm font-medium text-[#92a3bb]">Quick dates:</span>
                <button @click="setDatePreset(1)" class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs">Today</button>
                <button @click="setDatePreset(7)" class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs">7 days</button>
                <button @click="setDatePreset(30)" class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs">30 days</button>
              </div>
            </div>

            <!-- Clear Filters Button -->
            <div class="flex justify-end">
              <button
                @click="clearFilters"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Results Count -->
          <div class="mb-4 text-sm text-[#92a3bb]">
            Showing {{ filteredTransactions.length }} of {{ userTrans.length }} transactions
          </div>
        </div>
        
        <!-- Show skeleton loaders while transcripts are loading -->
        <div v-if="transcriptsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="n in 3" :key="n" class="bg-gray-700 bg-opacity-40 p-4 rounded-lg animate-pulse">
            <div class="h-6 bg-gray-600 rounded mb-3 w-3/4"></div>
            <div class="relative w-full h-48 bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
              <div class="text-gray-400">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4l2-2v6l-2-2v4H7V5z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-600 rounded w-full"></div>
              <div class="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        
        <!-- Display actual videos once loaded -->
        <div v-else-if="filteredTransactions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="(transaction, index) in filteredTransactions" :key="index" class="bg-gray-700 bg-opacity-40 p-4 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">
              <a 
                class="cursor-pointer text-[#a784ffd4] hover:underline"
                @click="goToDetails(transaction.id)"
              >
                {{ transaction.original_filename }}
              </a>
            </h3>
            <div v-if="transaction.video_url" class="mb-4">
              <div class="relative w-full h-48 bg-black rounded-lg overflow-hidden">
                <video 
                  :src="transaction.video_url" 
                  class="absolute inset-0 w-full h-full object-contain" 
                  controls
                  preload="metadata"
                ></video>
              </div>
            </div>
            <p v-else class="text-yellow-400 mb-4">No video available for this transcript</p>
            <div class="text-sm text-[#92a3bb] space-y-1">
              <p>Created: {{ new Date(transaction.created_at).toLocaleString() }}</p>
              <p v-if="transaction.duration">Duration: {{ formatDuration(transaction.duration) }}</p>
              <p v-if="transaction.file_size">File Size: {{ formatFileSize(transaction.file_size) }}</p>
              <p v-if="transaction.language_code">Language: {{ transaction.language_code }}</p>
              <p v-if="transaction.status">Status: {{ transaction.status }}</p>
            </div>
            <div class="mt-4 flex gap-2">
              <button
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                @click="promptDelete(transaction)"
              >Delete</button>
            </div>
          </div>
        </div>
        
        <div v-else-if="userTrans.length > 0" class="bg-gray-700 bg-opacity-40 p-6 rounded-lg mb-8">
          <p class="text-[#92a3bb]">No transactions match your current filters. Try adjusting your search criteria.</p>
        </div>
        
        <div v-else class="bg-gray-700 bg-opacity-40 p-6 rounded-lg mb-8">
          <p class="text-[#92a3bb]">No transcripts found. Your transcriptions will appear here once created.</p>
        </div>
        
      </div>
      
      <div v-else class="text-center py-12">
        <h2 class="text-2xl">Authentication Issue</h2>
        <p v-if="authError" class="text-red-400 mt-4">{{ authError }}</p>
        <p class="mt-4 text-[#92a3bb]">
          We're having trouble verifying your login status. 
          Please try signing in again.
        </p>
        <div class="flex justify-center mt-6 gap-4">
          <button 
            @click="loadUserData" 
            class="px-6 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            Retry
          </button>
          <router-link to="/signin" class="inline-block px-6 py-2 bg-[#a784ffd4] rounded-full">
            Sign In Again
          </router-link>
        </div>
      </div>
    </div>
    
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
        <p v-if="deleteError" class="text-red-600 mb-2">{{ deleteError }}</p>
        <p v-if="deleteLoading" class="text-gray-500">Deleting...</p>
      </template>
    </ConfirmModal>

    <!-- User Delete confirmation modal -->
    <ConfirmModal
      v-if="showDeleteUserModal"
      :title="'Delete User Account'"
      :message="`Are you sure you want to permanently delete the user account for '${userToDelete?.name} ${userToDelete?.surname}' (${userToDelete?.email})? This action cannot be undone and will remove all associated data.`"
      icon="warning"
      confirm-text="Delete User"
      confirm-variant="danger"
      cancel-text="Cancel"
      :show-footer="true"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
      @close="cancelDeleteUser"
    >
      <template #body>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Warning: Permanent Action</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>This will permanently delete:</p>
                <ul class="list-disc list-inside mt-1">
                  <li>User account and profile</li>
                  <li>All associated transactions and transcripts</li>
                  <li>All uploaded videos and files</li>
                  <li>User preferences and settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p v-if="deleteUserError" class="text-red-600 mb-2">{{ deleteUserError }}</p>
        <p v-if="deleteUserLoading" class="text-gray-500">Deleting user account...</p>
      </template>
    </ConfirmModal>

    <!-- Deactivate Account confirmation modal -->
    <ConfirmModal
      v-if="showDeactivateModal"
      :title="'Deactivate Account'"
      :message="'Are you sure you want to permanently delete your account? This action cannot be undone.'"
      icon="warning"
      confirm-text="Deactivate"
      confirm-variant="danger"
      cancel-text="Cancel"
      :show-footer="true"
      @confirm="confirmDeactivate"
      @cancel="cancelDeactivate"
      @close="cancelDeactivate"
    >
      <template #body>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Warning: Permanent Action</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>This will permanently delete your:</p>
                <ul class="list-disc list-inside mt-1">
                  <li>Profile and account</li>
                  <li>All transcripts and files</li>
                  <li>All uploaded videos and data</li>
                  <li>Settings and preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p v-if="deactivateError" class="text-red-600 mb-2">{{ deactivateError }}</p>
        <p v-if="deactivateLoading" class="text-gray-500">Deleting account...</p>
      </template>
    </ConfirmModal>

    <!-- Role Management Modal -->
    <ConfirmModal
  v-if="showRoleModal"
  :title="'Edit Role'"
  :message="'Update the properties for this role. Changes affect all users with this role.'"
  icon="info"
  confirm-text="Save"
  cancel-text="Cancel"
  :show-footer="true"
  @confirm="saveRole"
  @cancel="closeRoleModal"
  @close="closeRoleModal"
>
  <template #body>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs mb-1 text-black">Role Name</label>
        <input v-model="editingRole.name" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Price</label>
        <input v-model.number="editingRole.price" type="number" step="0.01" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Videos per Month</label>
        <input v-model.number="editingRole.videos_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Minutes per Month</label>
        <input v-model.number="editingRole.total_minutes_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Max Video Duration (s)</label>
        <input v-model.number="editingRole.max_video_duration" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Max File Size (MB)</label>
        <input v-model.number="editingRole.max_file_size_mb" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">SRT Exports/Month</label>
        <input v-model.number="editingRole.srt_exports_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
      </div>
      <div>
        <label class="block text-xs mb-1 text-black">Admin Role?</label>
        <select v-model="editingRole.is_admin" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
    </div>
    <div class="mt-4">
      <p v-if="roleModalError" class="text-red-600 mb-2">{{ roleModalError }}</p>
      <p v-if="roleModalLoading" class="text-gray-500">Saving...</p>
    </div>
  </template>
</ConfirmModal>

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
          <p v-if="passwordError" class="text-red-600">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="text-green-600">{{ passwordSuccess }}</p>
        </div>
      </div>
      <div class="pt-2">
        <p v-if="editProfileError" class="text-red-600">{{ editProfileError }}</p>
        <p v-if="editProfileSuccess" class="text-green-600">{{ editProfileSuccess }}</p>
      </div>
    </div>
  </template>
</ConfirmModal>
<ConfirmModal
v-if="showCreateRoleModal"
:title="'Create New Role'"
:message="'Define the properties for the new role. This will create a new subscription tier.'"
icon="plus"
confirm-text="Create Role"
cancel-text="Cancel"
:show-footer="true"
@confirm="createRole"
@cancel="closeCreateRoleModal"
@close="closeCreateRoleModal"
>
<template #body>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-xs mb-1 text-black">Role Name <span class="text-red-500">*</span></label>
      <input 
        v-model="newRole.name" 
        placeholder="e.g., Premium, Enterprise"
        class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
        :class="{ 'border-red-500': !newRole.name.trim() && createRoleError }"
      />
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Price ($)</label>
      <input v-model.number="newRole.price" type="number" step="0.01" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Videos per Month</label>
      <input v-model.number="newRole.videos_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Minutes per Month</label>
      <input v-model.number="newRole.total_minutes_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Max Video Duration (seconds)</label>
      <input v-model.number="newRole.max_video_duration" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Max File Size (MB)</label>
      <input v-model.number="newRole.max_file_size_mb" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">SRT Exports/Month</label>
      <input v-model.number="newRole.srt_exports_per_month" type="number" min="0" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"/>
    </div>
    <div>
      <label class="block text-xs mb-1 text-black">Admin Role?</label>
      <select v-model="newRole.is_admin" class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white">
        <option :value="false">No</option>
        <option :value="true">Yes</option>
      </select>
    </div>
  </div>
  <div class="mt-4">
    <p class="text-xs text-gray-600 mb-2">
      <span class="text-red-500">*</span> Required fields
    </p>
    <p v-if="createRoleError" class="text-red-600 mb-2">{{ createRoleError }}</p>
    <p v-if="createRoleLoading" class="text-gray-500">Creating role...</p>
  </div>
</template>
</ConfirmModal>
<ConfirmModal
  v-if="showDeleteRoleModal"
  :title="`Delete Role: ${roleToDelete?.name}`"
  :message="`Are you sure you want to delete the role '${roleToDelete?.name}'? This action cannot be undone.`"
  icon="warning"
  confirm-text="Delete Role"
  confirm-variant="danger"
  @confirm="confirmDeleteRole"
  @cancel="cancelDeleteRole"
  @close="cancelDeleteRole"
>
  <template #content>
    <div v-if="deleteRoleError" class="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ deleteRoleError }}
    </div>
    <div v-if="deleteRoleLoading" class="mt-3 flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      <span class="ml-2 text-sm text-gray-600">Deleting role...</span>
    </div>
  </template>
</ConfirmModal>
  </div>
</template>