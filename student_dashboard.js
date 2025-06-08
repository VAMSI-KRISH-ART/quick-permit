// Filename: student_dashboard.js (REVISED AND COMPLETE)

document.addEventListener('DOMContentLoaded', function() {
    // --- Basic Setup & Authentication ---
    const studentToken = localStorage.getItem('student_token');
    if (!studentToken) {
        alert('Access Denied. Please login first.');
        window.location.href = 'studentlogin.html';
        return;
    }

    const API_BASE_URL = 'http://localhost:5000';

    // --- Helper for Authenticated API calls ---
    const fetchWithAuth = (url, options = {}) => {
        const headers = {
            'Authorization': 'Bearer ' + studentToken,
            ...options.headers
        };
        return fetch(API_BASE_URL + url, { ...options, headers });
    };
    
    // --- Data Loading & Rendering Functions ---

    async function populateProfileData() {
        try {
            const response = await fetchWithAuth('/student/profile');
            if (!response.ok) throw new Error('Could not fetch profile.');
            
            const student = await response.json();
            
            // Populate Header
            document.querySelector('.profile .name').textContent = student.name;
            document.querySelector('.profile .details').textContent = `${student.academic_info.current_year} | Room #${student.hostel_info.room_no}`;
            if (student.profile_picture) document.querySelector('.profile img').src = student.profile_picture;

            // Populate Welcome Banner
            document.querySelector('.welcome-text h2').textContent = `Welcome back, ${student.name.split(' ')[0]}!`;
            
            // Populate Leave Summary
            const leaveStats = student.leave_stats;
            const progress = (leaveStats.leaves_taken / leaveStats.total_leaves_allowed) * 100;
            document.querySelector('.leave-summary .summary-value').textContent = `${leaveStats.balance}/${leaveStats.total_leaves_allowed}`;
            document.querySelector('.leave-summary .progress').style.width = `${progress}%`;
            
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Optionally redirect or show an error message
        }
    }

    async function populateNotices() {
        try {
            const response = await fetch(API_BASE_URL + '/notices'); // Public route
            if (!response.ok) throw new Error('Could not fetch notices.');

            const notices = await response.json();
            const noticeList = document.querySelector('.notices-list');
            noticeList.innerHTML = ''; // Clear static notices

            notices.slice(0, 3).forEach(notice => { // Show first 3 notices
                const noticeDate = new Date(notice.posted_on);
                const day = noticeDate.getDate().toString().padStart(2, '0');
                const month = noticeDate.toLocaleString('default', { month: 'short' });

                const noticeElement = `
                    <div class="notice-item">
                        <div class="notice-date"><span class="day">${day}</span><span class="month">${month}</span></div>
                        <div class="notice-content">
                            <h4>${notice.title}</h4>
                            <p>${notice.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                `;
                noticeList.innerHTML += noticeElement;
            });
        } catch (error) {
            console.error("Error fetching notices:", error);
            document.querySelector('.notices-list').innerHTML = '<p>Could not load notices.</p>';
        }
    }
    
    // --- Original Page Logic (Navigation, Modals, etc.) ---
    
    document.getElementById('current-day').textContent = new Date().toLocaleString('en-US', { weekday: 'long' });
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id === 'logout-btn') {
                document.getElementById('logout-modal').style.display = 'block';
                return;
            }
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });

    document.querySelector('.close-modal').addEventListener('click', () => document.getElementById('logout-modal').style.display = 'none');
    document.querySelector('.cancel-btn').addEventListener('click', () => document.getElementById('logout-modal').style.display = 'none');
    document.querySelector('.confirm-logout').addEventListener('click', () => {
        localStorage.removeItem('student_token');
        window.location.href = 'studentlogin.html';
    });
    
    document.getElementById('issue-image').addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
        document.querySelector('.file-name').textContent = fileName;
    });

    // --- Initial Data Load ---
    populateProfileData();
    populateNotices();
});