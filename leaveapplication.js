// Filename: leaveapplication.js

document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const totalDaysInput = document.getElementById('totalDays');
    const leaveForm = document.getElementById('leaveApplicationForm');
    
    function calculateDays() {
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            if (endDate < startDate) {
                totalDaysInput.value = 'Invalid date range';
                return;
            }
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            totalDaysInput.value = diffDays + ' day(s)';
        }
    }
    
    startDateInput.addEventListener('change', calculateDays);
    endDateInput.addEventListener('change', calculateDays);
    
    // Form submission handling
    leaveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // --- Validation ---
        const requiredFields = leaveForm.querySelectorAll('[required]');
        let valid = true;
        requiredFields.forEach(field => {
            field.style.borderColor = '#ddd'; // Reset border color
            if (!field.value.trim() && field.type !== 'checkbox') {
                valid = false;
                field.style.borderColor = '#e53935';
            }
            if (field.type === 'checkbox' && !field.checked) {
                valid = false;
                field.parentElement.style.color = '#e53935';
            }
        });
        
        if (!valid) {
            alert('Please fill all required fields and agree to the terms.');
            return;
        }

        // --- ADDED: API Call to Python Backend ---
        const studentToken = localStorage.getItem('student_token');
        if (!studentToken) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'studentlogin.html';
            return;
        }

        const formData = {
            leaveType: document.getElementById('leaveType').value,
            startDate: document.getElementById('startDate').value + 'T' + document.getElementById('startTime').value,
            endDate: document.getElementById('endDate').value + 'T' + document.getElementById('endTime').value,
            leaveReason: document.getElementById('leaveReason').value,
            leaveAddress: document.getElementById('leaveAddress').value,
            guardianContact: document.getElementById('guardianContact').value
        };

        fetch('http://localhost:5000/student/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + studentToken // Send the auth token
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = 'student_dashboard.html'; // Redirect on success
        })
        .catch(error => {
            console.error('Leave Application Error:', error);
            alert('Error submitting application: ' + error.message);
        });
    });
});
