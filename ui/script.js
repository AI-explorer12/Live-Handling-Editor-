let previousValues = {};
let notesData;
let vehicleParams = {}; // Added to store current handling parameters
let performanceData = {};
const handlingTemplate = `<fMass value="fMass_value"/>
<fInitialDragCoeff value="fInitialDragCoeff_value"/>
<fDownForceModifier value="fDownForceModifier_value"/>
<fPercentSubmerged value="fPercentSubmerged_value"/>
<vecCentreOfMassOffset x="vecCentreOfMassOffset_x_value" y="vecCentreOfMassOffset_y_value" z="vecCentreOfMassOffset_z_value"/>
<vecInertiaMultiplier x="vecInertiaMultiplier_x_value" y="vecInertiaMultiplier_y_value" z="vecInertiaMultiplier_z_value"/>
<fDriveBiasFront value="fDriveBiasFront_value"/>
<nInitialDriveGears value="nInitialDriveGears_value"/>
<fInitialDriveForce value="fInitialDriveForce_value"/>
<fDriveInertia value="fDriveInertia_value"/>
<fClutchChangeRateScaleUpShift value="fClutchChangeRateScaleUpShift_value"/>
<fClutchChangeRateScaleDownShift value="fClutchChangeRateScaleDownShift_value"/>
<fInitialDriveMaxFlatVel value="fInitialDriveMaxFlatVel_value"/>
<fBrakeForce value="fBrakeForce_value"/>
<fBrakeBiasFront value="fBrakeBiasFront_value"/>
<fHandBrakeForce value="fHandBrakeForce_value"/>
<fSteeringLock value="fSteeringLock_value"/>
<fTractionCurveMax value="fTractionCurveMax_value"/>
<fTractionCurveMin value="fTractionCurveMin_value"/>
<fTractionCurveLateral value="fTractionCurveLateral_value"/>
<fTractionSpringDeltaMax value="fTractionSpringDeltaMax_value"/>
<fLowSpeedTractionLossMult value="fLowSpeedTractionLossMult_value"/>
<fCamberStiffnesss value="fCamberStiffnesss_value"/>
<fTractionBiasFront value="fTractionBiasFront_value"/>
<fTractionLossMult value="fTractionLossMult_value"/>
<fSuspensionForce value="fSuspensionForce_value"/>
<fSuspensionCompDamp value="fSuspensionCompDamp_value"/>
<fSuspensionReboundDamp value="fSuspensionReboundDamp_value"/>
<fSuspensionUpperLimit value="fSuspensionUpperLimit_value"/>
<fSuspensionLowerLimit value="fSuspensionLowerLimit_value"/>
<fSuspensionRaise value="fSuspensionRaise_value"/>
<fSuspensionBiasFront value="fSuspensionBiasFront_value"/>
<fAntiRollBarForce value="fAntiRollBarForce_value"/>
<fAntiRollBarBiasFront value="fAntiRollBarBiasFront_value"/>
<fRollCentreHeightFront value="fRollCentreHeightFront_value"/>
<fRollCentreHeightRear value="fRollCentreHeightRear_value"/>
<fCollisionDamageMult value="fCollisionDamageMult_value"/>
<fWeaponDamageMult value="fWeaponDamageMult_value"/>
<fDeformationDamageMult value="fDeformationDamageMult_value"/>
<fEngineDamageMult value="fEngineDamageMult_value"/>
<fPetrolTankVolume value="fPetrolTankVolume_value"/>
<fOilVolume value="fOilVolume_value"/>
<fSeatOffsetDistX value="fSeatOffsetDistX_value"/>
<fSeatOffsetDistY value="fSeatOffsetDistY_value"/>
<fSeatOffsetDistZ value="fSeatOffsetDistZ_value"/>
<nMonetaryValue value="nMonetaryValue_value"/>`;

const resName = typeof GetParentResourceName == "function" ? GetParentResourceName() : "BabiczHandlingEditor";
const elements = {};

/* Fetch POST function */
async function Post(name, data) {
    try {
        const resp = await fetch(`https://${resName}/${name}`, {
            method: "POST",
            mode: "same-origin",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: data ? JSON.stringify(data) : "{}"
        });
        if (!resp.ok) {
            console.error('Error in Post request');
            return;
        }
        return await resp.json();
    } catch (err) {
        console.error('Error in Post request:', err);
    }
}



/* Initialize elements and attach input listeners */
window.onload = function () {
    const container = document.getElementById('container');
    const headerBar = document.getElementById('header-bar');
    container.style.display = "none";  // Initially hidden
    const names = ["fBrakeForce", "fDownForceModifier", "fPercentSubmerged", "fBrakeBiasFront", 
        "fCollisionDamageMult", "fDriveInertia", "vecInertiaMultiplier_x", "vecInertiaMultiplier_y", 
        "vecInertiaMultiplier_z", "fInitialDriveForce", "fDriveBiasFront", "fSeatOffsetDistZ", "fSuspensionCompDamp", 
        "fTractionLossMult", "fTractionSpringDeltaMax", "fSuspensionBiasFront", "vecCentreOfMassOffset_x", 
        "vecCentreOfMassOffset_y", "vecCentreOfMassOffset_z", "fRollCentreHeightRear", "fMass", 
        "fInitialDriveMaxFlatVel", "nInitialDriveGears", "strHandlingFlags", "strModelFlags", 
        "fClutchChangeRateScaleUpShift", "nMonetaryValue", "fTractionBiasFront", "fSteeringLock", 
        "fSuspensionUpperLimit", "fSeatOffsetDistX", "fAntiRollBarBiasFront", "fEngineDamageMult", "fOilVolume", 
        "fTractionCurveLateral", "fSuspensionRaise", "fDeformationDamageMult", "fWeaponDamageMult", 
        "fCamberStiffnesss", "fTractionCurveMin", "fSuspensionForce", "fAntiRollBarForce", 
        "fHandBrakeForce", "fSuspensionReboundDamp", "fLowSpeedTractionLossMult", "fRollCentreHeightFront", 
        "fPetrolTankVolume", "fClutchChangeRateScaleDownShift", "fTractionCurveMax", "fInitialDragCoeff", 
        "fSeatOffsetDistY", "fSuspensionLowerLimit"];

        // Initialize vehicleParams with current input values and add history buttons
        names.forEach(function (name) {
            const element = document.getElementById(name);
            if (element) {
                elements[name] = element;
                vehicleParams[name] = parseFloat(element.value) || 0;
    
                // Attach focus event listener to store the previous value
                element.addEventListener('focus', function () {
                    previousValues[name] = element.value;
                });
    
                // Modify the input event listener
                element.addEventListener('input', function () {
                    const value = Number(element.value);
                    if (!isNaN(value) && value !== '') {
                        vehicleParams[name] = value; // Update to new value
    
                        // Recalculate stats
                        updateVehicleStats();
    
                        // Send update to backend
                        Post('update', {
                            target: name,
                            value: value
                        });
                    }
                });
            }
        });
        
       
    document.querySelectorAll('tbody tr').forEach(row => {
        const valueName = row.querySelector('td:first-child').textContent;  // Assuming value name is in the first column

        row.addEventListener('click', () => {
            scrollToValueInInfoWindow(valueName);  // Calls the function to scroll to info window section
        });
    });

    // Event listener for the main table button
    const mainTableButton = document.getElementById('main-table-button');
    if (mainTableButton) {
        mainTableButton.addEventListener('click', showMainTable);
    } else {
        console.error('main-table-button element not found.');
    }
    
     // Event listener for the performance test button
    const performanceTestButton = document.getElementById('performance-test-button');
    if (performanceTestButton) {
        performanceTestButton.addEventListener('click', startPerformanceTest);
    } else {
        console.error('performance-test-button element not found.');
    }

    // Event listener for the stats button
    const statsButton = document.getElementById('stats-button');
    if (statsButton) {
        statsButton.addEventListener('click', showStatsTable);
    } else {
        console.error('stats-button element not found.');
    }


    // Event listener for the info button
    const infoButton = document.getElementById('info-btn');
    if (infoButton) {
        infoButton.addEventListener('click', openInfoWindow);
    }

    // Load the info-window.html dynamically
    fetch('info-window.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('info-window-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading Info Window:', error));

    // Fetch notes.json for descriptions
    fetch('notes.json')
        .then(response => response.json())
        .then(data => {
            notesData = data.notes;
            attachTooltipsToValues();  // Attach tooltips after data is loaded
        })
        .catch(error => console.error('Error loading notes:', error));
    
        // Add hover effect to table rows
    document.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = 'rgba(42, 42, 45,);';
        });
    });
    // Dragging functionality for the header
    let isDragging = false;
    let offsetX, offsetY;

    headerBar.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
    });

    window.addEventListener('mousemove', function (e) {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            newX = Math.max(0, Math.min(newX, screenWidth - containerWidth));
            newY = Math.max(0, Math.min(newY, screenHeight - containerHeight));

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
        }
    });

    window.addEventListener('mouseup', function () {
        isDragging = false;
    });
    
};

/* Add value */
function Add(name) {
    const element = elements[name];
    if (element) {
        const val = Number(element.value);
        if (!isNaN(val)) {
            Post("change", {
                type: "add",
                target: name
            }).then(function (result) {
                if (result !== false) {
                    element.value = result;
                }
            });
        }
    }
}

/* Subtract value */
function Substract(name) {
    const element = elements[name];
    if (element) {
        const val = Number(element.value);
        if (!isNaN(val)) {
            Post("change", {
                type: "substract",
                target: name
            }).then(function (result) {
                if (result !== false) {
                    element.value = result;
                }
            });
        }
    }
}

/* Export handling data */
function Export() {
    let result = handlingTemplate;
    for (const k in elements) {
        result = result.replaceAll(`${k}_value`, elements[k].value);
    }
    const element = document.createElement("textarea");
    element.value = result;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
}

function restorePreviousValue(fieldId) {
    const inputField = document.getElementById(fieldId);
    if (previousValues[fieldId] !== undefined) {
        const prevValue = previousValues[fieldId];
        vehicleParams[fieldId] = parseFloat(prevValue) || 0; // Update vehicleParams
        inputField.value = prevValue; // Update input field

        // Recalculate stats
        updateVehicleStats();

        // Send update to backend
        Post('update', {
            target: fieldId,
            value: vehicleParams[fieldId]
        });
    } else {
        console.log(`No previous value to restore for ${fieldId}`);
    }
}




function attachTooltipsToValues() {
    const tableRows = document.querySelectorAll('tbody tr');  // Select all table rows

    tableRows.forEach(row => {
        const inputElement = row.querySelector('.base-input');  // Find the input inside the row

        if (inputElement) {
            const valueName = inputElement.id;  // Get the ID from the input element

            // Attach tooltip on hover for the entire row
            row.addEventListener('mouseenter', () => {
                const description = notesData[valueName]?.description || 'No description available';
                showTooltip(row, description);  // Show tooltip for the row
            });

            row.addEventListener('mouseleave', () => {
                hideTooltip();  // Hide tooltip when leaving the row
            });
        }
    });
}



function showTooltip(element, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip hidden';
        document.body.appendChild(tooltip);
    }

    tooltip.textContent = text;
    tooltip.classList.remove('hidden');

    const rect = element.getBoundingClientRect();  // Get position of the entire row
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Position the tooltip above the hovered row
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight - 10}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.add('hidden');
    }
}



// Function to open the info window
function openInfoWindow() {
    const existingWindow = document.getElementById('info-window');
    if (existingWindow) {
        existingWindow.remove();
    }
    
    if (!notesData) {
        alert("Notes data is not available yet.");
        return;
    }

    const infoWindow = document.createElement('div');
    infoWindow.id = 'info-window';
    infoWindow.className = 'info-window-container';

    const headerBar = document.createElement('div');
    headerBar.id = 'info-window-header';
    headerBar.textContent = 'More Info - Drag Me';
    infoWindow.appendChild(headerBar);

    const infoContent = document.createElement('div');
    infoContent.id = 'info-window-content';
    infoContent.innerHTML = generateInfoContent();
    infoWindow.appendChild(infoContent);

    document.body.appendChild(infoWindow);

    let isDragging = false;
    let offsetX, offsetY;

    headerBar.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - infoWindow.offsetLeft;
        offsetY = e.clientY - infoWindow.offsetTop;
    });

    window.addEventListener('mousemove', function (e) {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            newX = Math.max(0, Math.min(newX, window.innerWidth - infoWindow.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - infoWindow.offsetHeight));
            infoWindow.style.left = `${newX}px`;
            infoWindow.style.top = `${newY}px`;
        }
    });

    window.addEventListener('mouseup', function () {
        isDragging = false;
    });
}
// Function to initialize dragging
function initializeDragging(infoWindow, headerBar) {
    let isDragging = false;
    let offsetX, offsetY;

    headerBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - infoWindow.offsetLeft;
        offsetY = e.clientY - infoWindow.offsetTop;
    });

    window.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            // Boundary checks
            newX = Math.max(0, Math.min(newX, window.innerWidth - infoWindow.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - infoWindow.offsetHeight));
            
            infoWindow.style.left = `${newX}px`;
            infoWindow.style.top = `${newY}px`;
        }
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

function generateInfoContent() {
    let content = '';
    if (!notesData) {
        return '<p>Information not available</p>';
    }
    for (const [key, value] of Object.entries(notesData)) {
        content += `<h3>${key}</h3><p>${value.description}</p><ul>`;
        if (Array.isArray(value.extra)) {
            value.extra.forEach(extraDetail => {
                content += `<li>${extraDetail}</li>`;
            });
        } else {
            content += '<li>No additional details available</li>';
        }
        content += `</ul>`;
    }
    return content;
}


function scrollToValueInInfoWindow(valueName) {
    const infoWindow = document.getElementById('info-window');
    if (!infoWindow) return;

    // Remove previous color highlights first
    const previousHighlights = infoWindow.querySelectorAll('.text-highlight');
    previousHighlights.forEach(element => {
        element.classList.remove('text-highlight');
    });

    // Find the correct section by looping through h3 tags
    const headings = infoWindow.querySelectorAll('h3');
    let valueSection = null;

    headings.forEach(heading => {
        if (heading.textContent === valueName) {
            valueSection = heading;
            
            // Add highlight to the heading
            heading.classList.add('text-highlight');
            
            // Add highlight to the description paragraph
            if (heading.nextElementSibling && heading.nextElementSibling.tagName === 'P') {
                heading.nextElementSibling.classList.add('text-highlight');
            }
            
            // Add highlight to the list if it exists
            if (heading.nextElementSibling.nextElementSibling && 
                heading.nextElementSibling.nextElementSibling.tagName === 'UL') {
                heading.nextElementSibling.nextElementSibling.classList.add('text-highlight');
                // Also highlight all list items
                const listItems = heading.nextElementSibling.nextElementSibling.querySelectorAll('li');
                listItems.forEach(item => item.classList.add('text-highlight'));
            }
        }
    });

    if (valueSection) {
        valueSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}



const container = document.getElementById('container');
let isResizing = false;
let currentHandle;
let startX, startY, startWidth, startHeight, startTop, startLeft;

const handles = document.querySelectorAll('.resize-handle');
handles.forEach(handle => {
    handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizing = true;
        currentHandle = e.target;
        startX = e.clientX;
        startY = e.clientY;

        const rect = container.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startTop = rect.top;
        startLeft = rect.left;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
});

function resize(e) {
    if (!isResizing) return;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    // Handle right edge resizing
    if (currentHandle.classList.contains('right')) {
        container.style.width = `${startWidth + dx}px`;

    // Handle left edge resizing
    } else if (currentHandle.classList.contains('left')) {
        const newWidth = startWidth - dx;
        if (newWidth > 50) { // Ensure the container doesn't shrink too much
            container.style.width = `${newWidth}px`;
            container.style.left = `${startLeft + dx}px`;
        }

    // Handle bottom edge resizing
    } else if (currentHandle.classList.contains('bottom')) {
        container.style.height = `${startHeight + dy}px`;

    // Handle top edge resizing, considering the header
    } else if (currentHandle.classList.contains('top')) {
        const newHeight = startHeight - dy;
        if (newHeight > 50) { // Ensure the container doesn't shrink too much
            container.style.height = `${newHeight}px`;
            container.style.top = `${startTop + dy}px`;
        }
    }

    // Update the content-area's size dynamically after resizing
    const contentArea = document.getElementById('content-area');
    const headerBar = document.getElementById('header-bar');
    const sidebar = document.getElementById('sidebar');

    // Adjust the content area height by subtracting the header bar's height
    const contentHeight = container.offsetHeight - headerBar.offsetHeight;
    contentArea.style.height = `${contentHeight}px`;

    // Adjust the content area width by subtracting the sidebar's width
    const contentWidth = container.offsetWidth - sidebar.offsetWidth;
    contentArea.style.width = `${contentWidth}px`;
}


function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}


function startResize(e) {
    isResizing = true;
    currentHandle = e.target;
    
    // Get initial positions and dimensions
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(getComputedStyle(container).width, 10);
    startHeight = parseInt(getComputedStyle(container).height, 10);
    startLeft = container.offsetLeft;
    startTop = container.offsetTop;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

/* Resize function */
function resize(e) {
    if (!isResizing) return;

    const width = startWidth + (e.clientX - startX);
    const height = startHeight + (e.clientY - startY);
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    const mainContent = document.getElementById('main-content');
    mainContent.style.width = `${container.clientWidth - sidebar.clientWidth}px`;
    mainContent.style.height = `${container.clientHeight}px`;
}

/* Search function */
function searchTable() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const nameCell = row.querySelector('td:first-child');
        const nameText = nameCell ? nameCell.textContent.toLowerCase() : '';
        row.style.display = nameText.includes(searchInput) ? '' : 'none';
    });
}

/* Event Listeners for search */
document.getElementById('search-bar').addEventListener('input', searchTable);

/* Message handler for showing and hiding UI, and updating performance data */
window.addEventListener('message', function (event) {
    const container = document.getElementById('container');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    let e = event.data;

    if (e.action === "show") {
        
        // Loop through each handling parameter received
        for (const k in (e.handling || {})) {
            if (elements[k]) {
                elements[k].value = e.handling[k]; // Update the input field
                vehicleParams[k] = parseFloat(e.handling[k]) || 0; // Update vehicleParams with the new value
            }
        }
        for (const k in (e.handling || {})) {
            if (elements[k]) {
                elements[k].value = e.handling[k];
                vehicleParams[k] = parseFloat(e.handling[k]) || 0;

                // Only initialize previousValues[k] if it's undefined
                if (previousValues[k] === undefined) {
                    previousValues[k] = vehicleParams[k];
                }
            }
        }

        // Display the container and adjust dimensions
        container.style.display = "block";
        mainContent.style.width = `${container.clientWidth - sidebar.clientWidth}px`;
        mainContent.style.height = `${container.clientHeight}px`;

        // Recalculate stats based on the loaded handling parameters
        updateVehicleStats();

        // Display performance data if available
        if (e.performanceData) {
            performanceData = e.performanceData;
            displayPerformanceMetrics();
        } else {
            // Clear any previous performance data
            performanceData = {};
            //clearPerformanceMetrics();
        }

    } else if (e.action === "hide") {
        container.style.display = "none";

    } else if (e.action === "updatePerformanceData") {
        // Update performance data and display
        performanceData = e.performanceData;
        displayPerformanceMetrics();
    }
});


window.addEventListener("keydown", function (e) {
    const container = document.getElementById('container');
    const infoWindow = document.getElementById('info-window');

    if (e.key == "Escape") {
        if (infoWindow) {
            document.body.removeChild(infoWindow);  // Removes the window instead of just hiding it
        } else {
            container.style.display = "none";
            Post("close");  // Notify the backend
        }
    }
});

function clearPerformanceMetrics() {
    const performanceMetricsTableBody = document.querySelector('#performance-metrics-table tbody');
    if (performanceMetricsTableBody) {
        performanceMetricsTableBody.innerHTML = ''; // Clear the table body
    }
}


function showMainTable() {
    const mainTable = document.getElementById('main-table');
    const statsContainer = document.getElementById('stats-container');

    if (mainTable && statsContainer) {
        mainTable.style.display = 'block';
        statsContainer.style.display = 'none';
    } else {
        console.error('Main table or stats container not found.');
    }
}

function showStatsTable() {
    const mainTable = document.getElementById('main-table');
    const statsContainer = document.getElementById('stats-container');

    if (mainTable && statsContainer) {
        mainTable.style.display = 'none';
        statsContainer.style.display = 'block';

        // Update vehicle stats whenever the stats table is shown
        updateVehicleStats();
    } else {
        console.error('Main table or stats container not found.');
    }
}


/* Function to calculate vehicle stats */
function calculateVehicleStats(params, scalingFactor) {
    const {
        fInitialDriveForce,
        fInitialDriveMaxFlatVel,
        fMass,
        fBrakeForce,
        fTractionCurveMax,
        fTractionCurveMin,
        fTractionCurveLateral,
        fSteeringLock,
        engineRPM = 6000 // Default value if not provided
    } = params;

    // Adjusted Top Speed (mph)
    //const topSpeedMph = fInitialDriveMaxFlatVel * 2.23694 * scalingFactor;

    // Horsepower (hp)
    const force = fInitialDriveForce * fMass * 9.81; // Driving force in Newtons
    const powerWatts = force * fInitialDriveMaxFlatVel; // Power in Watts
    const horsepower = powerWatts / 745.7; // Convert Watts to horsepower

    // Torque (Nm)
    const torqueNm = (horsepower * 5252) / engineRPM;

    // Acceleration (0-60 mph time)
    //const accelerationMs2 = force / fMass; // Acceleration in m/s^2
    //const zeroToSixtyTime = 26.82 / accelerationMs2; // Time in seconds to reach 60 mph

    // Braking Distance (from 60 mph)
    const brakingForce = fBrakeForce * fMass * 9.81; // Braking force in Newtons
    const decelerationMs2 = brakingForce / fMass; // Deceleration in m/s^2
    const initialVelocity = 26.82; // 60 mph in m/s
    const brakingDistance = (initialVelocity * initialVelocity) / (2 * decelerationMs2); // in meters

    // Traction
    const averageTraction = (fTractionCurveMax + fTractionCurveMin) / 2;

    // Agility
    const maxAgilityValue = 1.0;
    const agilitynumber = (fTractionCurveLateral * fSteeringLock) / fMass;
    const agilityValue = (agilitynumber/maxAgilityValue) * 100;

    // Return the calculated stats
    return {
        horsepower: parseFloat(horsepower.toFixed(2)),
        torqueNm: parseFloat(torqueNm.toFixed(2)),
        brakingDistance: parseFloat(brakingDistance.toFixed(2)),
        averageTraction: parseFloat(averageTraction.toFixed(2)),
        agilityValue: parseFloat(agilityValue.toFixed(4))
    };
}

/* Function to update vehicle stats */
function updateVehicleStats() {
    // Determine the scaling factor dynamically, if necessary
    const maxDriveMaxFlatVel = 220; // Replace with the max value from your dataset
    const maxCalculatedSpeed = maxDriveMaxFlatVel * 2.23694;
    const maxInGameSpeed = 140; // Your server's speed cap in mph
    const scalingFactor = maxInGameSpeed / maxCalculatedSpeed; // Adjust as needed

    // Prepare parameters for stats calculation
    const params = {
        fInitialDriveForce: vehicleParams['fInitialDriveForce'] || 0,
        fInitialDriveMaxFlatVel: vehicleParams['fInitialDriveMaxFlatVel'] || 0,
        fMass: vehicleParams['fMass'] || 0,
        fBrakeForce: vehicleParams['fBrakeForce'] || 0,
        fTractionCurveMax: vehicleParams['fTractionCurveMax'] || 0,
        fTractionCurveMin: vehicleParams['fTractionCurveMin'] || 0,
        fTractionCurveLateral: vehicleParams['fTractionCurveLateral'] || 0,
        fSteeringLock: vehicleParams['fSteeringLock'] || 0,
        engineRPM: vehicleParams['engineRPM'] || 6000 // Default RPM if not provided
    };

    // Calculate the stats with the current parameters
    const stats = calculateVehicleStats(params, scalingFactor);

    // Update the stats display
    displayVehicleStats(stats);
}

/* Function to display vehicle stats */
function displayVehicleStats(stats) {
    // Check if stats table exists
    let statsTable = document.getElementById('stats-table');
    if (!statsTable) {
        // Create stats table if it doesn't exist
        statsTable = document.createElement('table');
        statsTable.id = 'stats-table';
        statsTable.className = 'stats-table';

        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.appendChild(statsTable);
        } else {
            // Create stats container if it doesn't exist
            const statsContainer = document.createElement('div');
            statsContainer.id = 'stats-container';
            statsContainer.className = 'stats-container';
            statsContainer.appendChild(statsTable);
            document.body.appendChild(statsContainer);
        }
    }

    // Clear existing stats
    statsTable.innerHTML = '';

    // Populate stats table
    for (const [key, value] of Object.entries(stats)) {
        const row = document.createElement('tr');
        const statNameCell = document.createElement('td');
        const statValueCell = document.createElement('td');

        statNameCell.textContent = formatStatName(key);
        statValueCell.textContent = value;

        row.appendChild(statNameCell);
        row.appendChild(statValueCell);
        statsTable.appendChild(row);
    }
}

/* Helper function to format stat names */
function formatStatName(key) {
    const statNames = {
        horsepower: 'Horsepower (hp)',
        torqueNm: 'Torque (Nm)',
        brakingDistance: 'Braking Distance (m)',
        averageTraction: 'Average Traction',
        agilityValue: 'Agility Value (%)'
    };
    return statNames[key] || key;
}

/* Function to toggle stats display */
function toggleStatsDisplay() {
    const mainTable = document.getElementById('main-table');
    const statsContainer = document.getElementById('stats-container');

    if (mainTable && statsContainer) {
        if (mainTable.style.display !== 'none') {
            mainTable.style.display = 'none';
            statsContainer.style.display = 'block';
        } else {
            mainTable.style.display = 'block';
            statsContainer.style.display = 'none';
        }
    }
}

// Define the startPerformanceTest function
function startPerformanceTest() {
    // Close all windows and start the performance test
    const container = document.getElementById('container');
    container.style.display = 'none';

    // Send message to backend to start recording
    Post('startPerformanceTest', {});
    // The performance data will be received when the handling editor is opened again
}

function displayPerformanceMetrics() {
    const performanceMetricsTableBody = document.querySelector('#performance-metrics-table tbody');
    performanceMetricsTableBody.innerHTML = ''; // Clear previous data

    // Define the desired order of metrics
    const metricsOrder = ['0-60 mph', '0-120 mph', '0-140 mph', '1/4 Mile Time', '1/2 Mile Time', 'Top Speed'];

    metricsOrder.forEach(metric => {
        if (performanceData.hasOwnProperty(metric)) {
            const value = performanceData[metric];
            const row = document.createElement('tr');

            const metricCell = document.createElement('td');
            metricCell.textContent = metric;

            const valueCell = document.createElement('td');
            valueCell.textContent = value;

            row.appendChild(metricCell);
            row.appendChild(valueCell);

            performanceMetricsTableBody.appendChild(row);
        }
    });
}


/* --- End of Added Code --- */