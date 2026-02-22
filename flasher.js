// FLASHER LOGIC
document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const btnConnect = document.getElementById('btn-connect');
    const status1 = document.getElementById('status-1');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    const fileBoot = document.getElementById('file-boot');
    const fileDtbo = document.getElementById('file-dtbo');
    const fileVendorBoot = document.getElementById('file-vendor-boot');
    const btnFlashRecovery = document.getElementById('btn-flash-recovery');
    const progress2 = document.getElementById('progress-2');

    const fileRom = document.getElementById('file-rom');
    const btnSideload = document.getElementById('btn-sideload');
    const progress3 = document.getElementById('progress-3');
    const sideloadBar = document.getElementById('sideload-bar');
    const sideloadText = document.getElementById('sideload-text');

    let usbDevice = null;

    // STEP 1: Connect to Device
    btnConnect.addEventListener('click', async () => {
        try {
            // Request USB Device (Google devices: Vendor ID 0x18d1)
            usbDevice = await navigator.usb.requestDevice({
                filters: [{ vendorId: 0x18d1 }]
            });
            
            await usbDevice.open();
            
            console.log('Connected:', usbDevice.productName, usbDevice.manufacturerName);
            
            // Note: Actual ADB/Fastboot implementation requires a library like @yume-chan/adb
            // For the scope of this UI template, we simulate the connection state.
            
            status1.classList.remove('hidden');
            status1.innerHTML = `<i class="fa-solid fa-check-circle text-crdroid"></i> Connected to ${usbDevice.manufacturerName} ${usbDevice.productName}`;
            btnConnect.disabled = true;
            btnConnect.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnConnect.classList.remove('bg-crdroid', 'hover:bg-green-600', 'text-white');

            // Move to Step 2
            step1.classList.remove('step-active');
            step1.classList.add('step-done');
            step2.classList.remove('step-inactive');
            step2.classList.add('step-active');

            fileBoot.disabled = false;
            fileDtbo.disabled = false;
            fileVendorBoot.disabled = false;

        } catch (error) {
            console.error(error);
            if (error.name === 'NotFoundError') {
                alert('No device selected. Please make sure your device is connected and USB debugging is enabled.');
            } else {
                alert(`Error connecting to device: ${error.message}`);
            }
        }
    });

    // Handle File Inputs for Step 2
    const checkRecoveryFiles = () => {
        if (fileBoot.files.length > 0 && fileDtbo.files.length > 0 && fileVendorBoot.files.length > 0) {
            btnFlashRecovery.disabled = false;
            btnFlashRecovery.classList.remove('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnFlashRecovery.classList.add('bg-crdroid', 'hover:bg-green-600', 'text-white');
        } else {
            btnFlashRecovery.disabled = true;
            btnFlashRecovery.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnFlashRecovery.classList.remove('bg-crdroid', 'hover:bg-green-600', 'text-white');
        }
    };

    fileBoot.addEventListener('change', checkRecoveryFiles);
    fileDtbo.addEventListener('change', checkRecoveryFiles);
    fileVendorBoot.addEventListener('change', checkRecoveryFiles);

    // STEP 2: Flash Recovery Images
    btnFlashRecovery.addEventListener('click', async () => {
        btnFlashRecovery.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Flashing...`;
        btnFlashRecovery.disabled = true;
        progress2.classList.remove('hidden');
        
        /* 
        =========================================================
        INTEGRATION NOTE FOR MAINTAINER:
        Here is where you implement the @yume-chan/adb WebUSB API.
        1. Reboot to bootloader: adb.reboot('bootloader')
        2. Wait for device reconnection via fastboot.
        3. Flash files: fastboot.flash('boot', fileBoot.files[0])
           fastboot.flash('dtbo', fileDtbo.files[0])
           fastboot.flash('vendor_boot', fileVendorBoot.files[0])
        =========================================================
        */

        // Simulate flashing process
        await new Promise(resolve => setTimeout(resolve, 2000));
        progress2.querySelector('div').style.width = '66%';
        await new Promise(resolve => setTimeout(resolve, 2000));
        progress2.querySelector('div').style.width = '100%';

        btnFlashRecovery.innerHTML = `<i class="fa-solid fa-check text-white"></i> Flashed Successfully`;
        btnFlashRecovery.classList.remove('hover:bg-green-600');

        // Move to Step 3
        step2.classList.remove('step-active');
        step2.classList.add('step-done');
        step3.classList.remove('step-inactive');
        step3.classList.add('step-active');

        fileRom.disabled = false;
    });

    // Handle File Input for Step 3
    fileRom.addEventListener('change', () => {
        if (fileRom.files.length > 0) {
            btnSideload.disabled = false;
            btnSideload.classList.remove('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnSideload.classList.add('bg-crdroid', 'hover:bg-green-600', 'text-white');
        } else {
            btnSideload.disabled = true;
            btnSideload.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
            btnSideload.classList.remove('bg-crdroid', 'hover:bg-green-600', 'text-white');
        }
    });

    // STEP 3: Sideload ROM
    btnSideload.addEventListener('click', async () => {
        const file = fileRom.files[0];
        
        btnSideload.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sideloading...`;
        btnSideload.disabled = true;
        progress3.classList.remove('hidden');

        /* 
        =========================================================
        INTEGRATION NOTE FOR MAINTAINER:
        Here is where you implement the adb sideload.
        Since the file is massive (1.4GB+), you must use Streams.
        
        Example using @yume-chan/adb:
        const stream = file.stream();
        await adb.sync.sideload(stream);
        =========================================================
        */

        // Simulate sideloading a large file
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1; // Fake 1% increments
            sideloadBar.style.width = `${progress}%`;
            sideloadText.innerText = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                btnSideload.innerHTML = `<i class="fa-solid fa-check-double text-white"></i> Sideload Complete!`;
                btnSideload.classList.remove('hover:bg-green-600');
                
                step3.classList.remove('step-active');
                step3.classList.add('step-done');
                
                alert("Sideload complete! You can now select 'Reboot system now' on your device.");
            }
        }, 100);
    });

});
