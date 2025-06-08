document.addEventListener('DOMContentLoaded', function() {
    // Update current date and day
    updateDateTime();
    
    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item:not(.logout)');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    
    logoutBtn.addEventListener('click', function() {
        logoutModal.style.display = 'flex';
    });
    
    cancelLogout.addEventListener('click', function() {
        logoutModal.style.display = 'none';
    });
    
    confirmLogout.addEventListener('click', function() {
        // In a real application, you would handle logout logic here
        alert('Logging out... Redirecting to login page.');
        // window.location.href = 'studentlogin.html';
        logoutModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });
    
    // Leave management buttons
    const manageLeaveBtn = document.querySelector('.manage-leave');
    const todayLeaveBtn = document.querySelector('.today-leave');
    const leaveStatusBtn = document.querySelector('.leave-status');
    
    manageLeaveBtn.addEventListener('click', function() {
        alert('Opening Leave Application Management');
    });
    
    todayLeaveBtn.addEventListener('click', function() {
        alert('Showing Today\'s Leave History');
    });
    
    leaveStatusBtn.addEventListener('click', function() {
        alert('Showing Leave Status Dashboard');
    });
    
    // Create notice button
    const createNoticeBtn = document.getElementById('create-notice');
    createNoticeBtn.addEventListener('click', function() {
        alert('Opening form to create new notice');
    });
    
    // Week selector in mess info
    const weekBtns = document.querySelectorAll('.week-btn');
    weekBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            weekBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('current-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Update every minute
    setTimeout(updateDateTime, 60000);
}

// Function to handle file upload preview (for issue reporting)
function handleFileUpload(event) {
    const files = event.target.files;
    const previewContainer = document.createElement('div');
    previewContainer.className = 'upload-preview';
    
    for (let file of files) {
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                previewContainer.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    }
    
    event.target.parentNode.appendChild(previewContainer);
}

// Add event listener for file upload
const fileUpload = document.querySelector('input[type="file"]');
if (fileUpload) {
    fileUpload.addEventListener('change', handleFileUpload);
}