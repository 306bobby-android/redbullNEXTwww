// FLASHER LOGIC
document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const deviceSelect = document.getElementById('device-select');
    const btnConnect = document.getElementById('btn-connect');
    const status1 = document.getElementById('status-1');
    const step1 = document.getElementById('step-1');
    const browserWarning = document.getElementById('browser-warning');
    const flasherSteps = document.getElementById('flasher-steps');
    
    // Browser Compatibility Check
    if (!navigator.usb) {
        browserWarning.classList.remove('hidden');
        flasherSteps.classList.add('opacity-50', 'pointer-events-none');
        deviceSelect.disabled = true;
        btnConnect.disabled = true;
        return; // Stop further execution
    }

    const step2 = document.getElementById('step-2');
    const btnFlashRecovery = document.getElementById('btn-flash-recovery');
    const progressContainer2 = document.getElementById('progress-container-2');
    const dlStatus2 = document.getElementById('dl-status-2');
    const dlBar2 = document.getElementById('dl-bar-2');
    const dlPercent2 = document.getElementById('dl-percent-2');

    const step3 = document.getElementById('step-3');
    const btnSideload = document.getElementById('btn-sideload');
    const progressContainer3 = document.getElementById('progress-container-3');
    const dlStatus3 = document.getElementById('dl-status-3');
    const dlBar3 = document.getElementById('dl-bar-3');
    const dlPercent3 = document.getElementById('dl-percent-3');

    let usbDevice = null;
    let selectedDevice = null;
    let deviceData = null;

    // OTA API Base
    const baseUrl = 'https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/16.0';

    // Enable connect button when device is selected
    deviceSelect.addEventListener('change', () => {
        selectedDevice = deviceSelect.value;
        if (selectedDevice) {
            btnConnect.disabled = false;
            btnConnect.classList.remove('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnConnect.classList.add('bg-brand', 'hover:opacity-80', 'text-white');
        }
    });

    // STEP 1: Connect to Device
    btnConnect.addEventListener('click', async () => {
        try {
            // Request USB Device
            usbDevice = await navigator.usb.requestDevice({
                filters: [{ vendorId: 0x18d1 }]
            });
            await usbDevice.open();
            
            console.log('Connected:', usbDevice.productName, usbDevice.manufacturerName);
            
            // Fetch JSON Data for the device
            status1.classList.remove('hidden');
            status1.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-brand"></i> Fetching latest release info...`;
            
            const response = await fetch(`${baseUrl}/${selectedDevice}.json`);
            if (!response.ok) throw new Error('Failed to fetch device JSON');
            const data = await response.json();
            deviceData = data.response[0];

            status1.innerHTML = `<i class="fa-solid fa-check-circle text-brand"></i> Connected to ${usbDevice.manufacturerName} ${usbDevice.productName} - Found v${deviceData.version}`;
            
            btnConnect.disabled = true;
            btnConnect.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnConnect.classList.remove('bg-brand', 'hover:opacity-80', 'text-white');
            deviceSelect.disabled = true;

            // Move to Step 2
            step1.classList.remove('step-active');
            step1.classList.add('step-done');
            step2.classList.remove('step-inactive');
            step2.classList.add('step-active');

        } catch (error) {
            console.error(error);
            if (error.name === 'NotFoundError') {
                alert('No device selected. Please make sure your device is connected and USB debugging is enabled.');
            } else {
                alert(`Error connecting or fetching data: ${error.message}`);
                status1.classList.add('hidden');
            }
        }
    });

    // Helper: Simulated Download & Progress Tracking
    // In production, this uses fetch() and ReadableStream
    async function simulateDownload(name, bar, textElement, statusElement) {
        statusElement.innerText = `Downloading ${name}...`;
        let progress = 0;
        
        // This is a simulation since SourceForge CORS blocks direct JS fetching.
        // If testing real fetch, you would implement ReadableStream here.
        return new Promise(resolve => {
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5; // Fake 5-20% jumps
                if (progress > 100) progress = 100;
                
                bar.style.width = `${progress}%`;
                textElement.innerText = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 300);
        });
    }

    // STEP 2: Download & Flash Recovery Images
    btnFlashRecovery.addEventListener('click', async () => {
        btnFlashRecovery.disabled = true;
        btnFlashRecovery.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
        btnFlashRecovery.classList.remove('bg-brand', 'hover:opacity-80', 'text-white');
        progressContainer2.classList.remove('hidden');
        
        try {
            // Simulated downloads
            await simulateDownload('boot.img', dlBar2, dlPercent2, dlStatus2);
            dlPercent2.innerText = "0%"; dlBar2.style.width = "0%";
            await simulateDownload('dtbo.img', dlBar2, dlPercent2, dlStatus2);
            dlPercent2.innerText = "0%"; dlBar2.style.width = "0%";
            await simulateDownload('vendor_boot.img', dlBar2, dlPercent2, dlStatus2);

            // Flashing Simulation
            dlStatus2.innerText = "Flashing images to device...";
            dlBar2.classList.remove('bg-blue-500');
            dlBar2.classList.add('bg-brand');
            dlBar2.style.width = '100%';
            dlPercent2.innerText = "";
            
            /* 
            =========================================================
            INTEGRATION NOTE:
            1. Fetch actual .img files from SourceForge URL / API.
            2. adb.reboot('bootloader')
            3. fastboot.flash('boot', downloadedBootBlob)
            4. fastboot.flash('dtbo', downloadedDtboBlob)
            5. fastboot.flash('vendor_boot', downloadedVendorBootBlob)
            =========================================================
            */
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // fake flash time
            
            dlStatus2.innerText = "Flashed successfully! Rebooting to recovery...";
            
            // Move to Step 3
            setTimeout(() => {
                step2.classList.remove('step-active');
                step2.classList.add('step-done');
                step3.classList.remove('step-inactive');
                step3.classList.add('step-active');
            }, 1000);

        } catch(e) {
            dlStatus2.innerText = `Error: ${e.message}`;
            dlStatus2.classList.add('text-red-500');
        }
    });

    // STEP 3: Download & Sideload ROM
    btnSideload.addEventListener('click', async () => {
        btnSideload.disabled = true;
        btnSideload.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
        btnSideload.classList.remove('bg-brand', 'hover:opacity-80', 'text-white');
        progressContainer3.classList.remove('hidden');

        try {
            await simulateDownload(`crDroid v${deviceData.version}`, dlBar3, dlPercent3, dlStatus3);
            
            dlStatus3.innerText = "Streaming ROM to device via sideload...";
            
            /* 
            =========================================================
            INTEGRATION NOTE:
            1. Use Streams to pipe the fetch response body directly 
               to adb sideload.
            2. await adb.sync.sideload(fetchResponse.body)
            =========================================================
            */

            await simulateDownload(`Sideloading...`, dlBar3, dlPercent3, dlStatus3);

            dlStatus3.innerText = "Sideload Complete! Please select 'Reboot system now' on your device.";
            dlStatus3.classList.add('text-brand', 'font-bold');

            step3.classList.remove('step-active');
            step3.classList.add('step-done');
            
        } catch(e) {
            dlStatus3.innerText = `Error: ${e.message}`;
            dlStatus3.classList.add('text-red-500');
        }
    });
});
