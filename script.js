// Function to display messages (now only used on index.html for input validation)
function showStatusMessage(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = '';
        statusDiv.classList.add('status-' + type);
        statusDiv.style.display = 'block';

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } else {
        console.log(`Status (${type}): ${message}`);
    }
}

// Simulate a backend API call
async function simulateApiCall(data, serviceType) {
    return new Promise(resolve => {
        // Simulate a longer delay for ride requests, slightly shorter for others
        const delay = (serviceType === 'Ride') ? 4000 : 3000;
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                resolve({
                    success: true,
                    message: `${serviceType} request successful! Looking for a provider...`,
                    details: data
                });
            } else {
                resolve({
                    success: false,
                    message: `Failed to process ${serviceType} request. Please try again.`,
                    error: 'Network error or no providers available'
                });
            }
        }, delay);
    });
}

// --- Ride Request Functions (initiated from index.html, processed on requesting_ride.html) ---

// Initiates a ride request from the main page
async function initiateRideRequest() {
    const pickup = document.getElementById('pickupLocation').value;
    const destination = document.getElementById('destination').value;
    const rideType = document.getElementById('rideType').value;

    if (!pickup || !destination) {
        showStatusMessage('Please enter both pickup and destination locations.', 'error');
        return;
    }

    localStorage.setItem('currentRideRequest', JSON.stringify({
        type: 'Ride', // Explicitly mark type for processing page
        pickup: pickup,
        destination: destination,
        rideType: rideType
    }));

    window.location.href = 'requesting_ride.html';
}

// Processes the ride request on requesting_ride.html load
async function processRideRequest() {
    const rideDetailsDisplay = document.getElementById('rideDetailsDisplay');
    const storedRequest = localStorage.getItem('currentRideRequest');

    if (!storedRequest) {
        rideDetailsDisplay.textContent = 'No ride request found.';
        setTimeout(goToMainPage, 1000); // Redirect after a short delay
        return;
    }

    const rideData = JSON.parse(storedRequest);
    rideDetailsDisplay.textContent = `From: ${rideData.pickup} To: ${rideData.destination} (${rideData.rideType})`;

    console.log("Processing Ride Request Data:", rideData);

    const response = await simulateApiCall(rideData, 'Ride');

    if (response.success) {
        alert("Ride found! A driver is on their way!");
        console.log(response.message);
        localStorage.removeItem('currentRideRequest');
        goToMainPage();
    } else {
        alert("Ride request failed: " + response.message);
        console.error(response.message);
        localStorage.removeItem('currentRideRequest');
        goToMainPage();
    }
}

// --- Roadside Service Functions (initiated from index.html, processed on processing_roadside.html) ---

// Initiates a roadside service request from the main page
async function initiateRoadsideRequest(serviceName) {
    const currentLocation = document.getElementById('pickupLocation').value; // Re-using pickup field for current location

    if (!currentLocation || currentLocation.includes("Unable to get current location")) {
        showStatusMessage('Please ensure your current location is available for roadside assistance.', 'error');
        return;
    }

    localStorage.setItem('currentRoadsideRequest', JSON.stringify({
        type: 'Roadside', // Explicitly mark type
        serviceType: serviceName,
        location: currentLocation,
        timestamp: new Date().toISOString()
    }));

    window.location.href = 'processing_roadside.html';
}

// Processes the roadside request on processing_roadside.html load
async function processRoadsideRequest() {
    const roadsideServiceDisplay = document.getElementById('roadsideServiceDisplay');
    const storedRequest = localStorage.getItem('currentRoadsideRequest');

    if (!storedRequest) {
        roadsideServiceDisplay.textContent = 'No roadside request found.';
        setTimeout(goToMainPage, 1000);
        return;
    }

    const serviceData = JSON.parse(storedRequest);
    roadsideServiceDisplay.textContent = `Service: ${serviceData.serviceType} at ${serviceData.location}`;

    console.log("Processing Roadside Service Request Data:", serviceData);

    const response = await simulateApiCall(serviceData, serviceData.serviceType);

    if (response.success) {
        alert(`${serviceData.serviceType} request successful! Provider assigned.`);
        console.log(response.message);
        localStorage.removeItem('currentRoadsideRequest');
        goToMainPage();
    } else {
        alert(`${serviceData.serviceType} request failed: ` + response.message);
        console.error(response.message);
        localStorage.removeItem('currentRoadsideRequest');
        goToMainPage();
    }
}

// --- SOS Button Functions (initiated from index.html, processed on sos_request.html) ---

// Initiates an SOS request from the main page
async function requestSos() {
    const currentLocation = document.getElementById('pickupLocation').value;

    if (!currentLocation || currentLocation.includes("Unable to get current location")) {
        showStatusMessage('Please ensure your current location is available for emergency assistance.', 'error');
        return;
    }

    localStorage.setItem('currentSosRequest', JSON.stringify({
        type: 'SOS', // Explicitly mark type
        location: currentLocation,
        timestamp: new Date().toISOString()
    }));

    window.location.href = 'sos_request.html';
}

// Processes the SOS request on sos_request.html load
async function processSosRequest() {
    const sosDetailsDisplay = document.getElementById('sosDetailsDisplay');
    const storedRequest = localStorage.getItem('currentSosRequest');

    if (!storedRequest) {
        sosDetailsDisplay.textContent = 'No SOS request found.';
        setTimeout(goToMainPage, 1000);
        return;
    }

    const sosData = JSON.parse(storedRequest);
    sosDetailsDisplay.textContent = `Sending SOS from: ${sosData.location}`;

    console.log("Processing SOS Request Data:", sosData);

    const response = await simulateApiCall(sosData, 'SOS');

    if (response.success) {
        alert("SOS request sent! Emergency services notified.");
        console.log(response.message);
        localStorage.removeItem('currentSosRequest');
        goToMainPage();
    } else {
        alert("SOS request failed: " + response.message);
        console.error(response.message);
        localStorage.removeItem('currentSosRequest');
        goToMainPage();
    }
}


// --- General Navigation Functions ---

// Function to cancel any pending request (called from processing pages)
function cancelRequest() {
    if (localStorage.getItem('currentRideRequest')) {
        localStorage.removeItem('currentRideRequest');
        alert('Ride request cancelled!');
    } else if (localStorage.getItem('currentRoadsideRequest')) {
        localStorage.removeItem('currentRoadsideRequest');
        alert('Roadside service request cancelled!');
    } else if (localStorage.getItem('currentSosRequest')) {
        localStorage.removeItem('currentSosRequest');
        alert('SOS emergency cancelled!');
    }
    goToMainPage();
}

// Function to go back to the main page
function goToMainPage() {
    window.location.href = 'index.html';
}

// This function runs when *any* page loads
window.onload = () => {
    const path = window.location.pathname;

    if (path.includes('requesting_ride.html')) {
        processRideRequest();
    } else if (path.includes('processing_roadside.html')) {
        processRoadsideRequest();
    } else if (path.includes('sos_request.html')) {
        processSosRequest();
    } else {
        // This is index.html or another page (e.g., initial load)
        const pickupInput = document.getElementById('pickupLocation');
        if (pickupInput && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                pickupInput.value = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
            }, (error) => {
                console.error("Geolocation error:", error);
                // Retain "My Current Location" or set a default if getting coords fails
                if (pickupInput.value === "My Current Location") {
                    // Do nothing, let default value persist
                } else {
                    pickupInput.value = "Unable to get current location";
                }
            });
        } else if (pickupInput) {
            pickupInput.value = "Geolocation not supported by this browser";
        }
    }
};