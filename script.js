document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();

    const baseUrl = 'https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/16.0';
    
    const devices = [
        { id: 'bramble', name: 'Pixel 4a 5G', icon: 'fa-mobile' },
        { id: 'redfin', name: 'Pixel 5', icon: 'fa-mobile-screen' },
        { id: 'barbet', name: 'Pixel 5a', icon: 'fa-mobile-button' }
    ];

    const container = document.getElementById('device-container');
    container.innerHTML = ''; // Clear loading text

    // Render device cards
    devices.forEach(device => {
        const cardHtml = `
            <div class="device-card bg-cardbg rounded-2xl p-8 border border-gray-800 flex flex-col items-center text-center group cursor-pointer" onclick="openModal('${device.id}', '${device.name}')">
                <div class="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors border border-gray-800">
                    <i class="fa-solid ${device.icon} text-4xl text-gray-400 group-hover:text-brand transition-colors"></i>
                </div>
                <h3 class="text-2xl font-bold mb-2 text-white">${device.name}</h3>
                <p class="text-brand font-mono mb-6">${device.id}</p>
                <button class="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-gray-700 flex items-center justify-center gap-2 mt-auto">
                    <i class="fa-solid fa-circle-info"></i> View Details
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Modal Logic
    const modal = document.querySelector('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    window.openModal = async (deviceId, deviceName) => {
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');
        
        titleEl.innerHTML = `<i class="fa-solid fa-mobile-screen text-brand mr-2"></i> ${deviceName} <span class="text-sm font-mono text-gray-500 ml-2">(${deviceId})</span>`;
        bodyEl.innerHTML = `<div class="flex justify-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-brand"></i></div>`;
        
        // Show modal
        modal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('modal-active');

        try {
            // Fetch JSON
            const response = await fetch(`${baseUrl}/${deviceId}.json`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const buildInfo = data.response[0];

            // Fetch Changelog (optional, handle gracefully if missing)
            let changelogHtml = '<p class="text-gray-500 italic">Changelog not available.</p>';
            try {
                const clResponse = await fetch(`${baseUrl}/${deviceId}_changelog.txt`);
                if (clResponse.ok) {
                    const clText = await clResponse.text();
                    changelogHtml = `<pre class="bg-gray-900 p-4 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto border border-gray-800 max-h-64 overflow-y-auto whitespace-pre-wrap">${clText}</pre>`;
                }
            } catch (clError) {
                console.warn('Changelog fetch failed:', clError);
            }

            const date = new Date(buildInfo.timestamp * 1000).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Format size
            const sizeMB = (buildInfo.size / (1024 * 1024)).toFixed(2);

            bodyEl.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Version</p>
                        <p class="font-bold text-lg text-white">${buildInfo.version} (${buildInfo.buildtype})</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Build Date</p>
                        <p class="font-medium text-white"><i class="fa-regular fa-calendar-days text-brand mr-2"></i>${date}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">File Size</p>
                        <p class="font-mono text-gray-300">${sizeMB} MB</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Maintainer</p>
                        <p class="font-medium text-white"><i class="fa-solid fa-user-gear text-brand mr-2"></i>${buildInfo.maintainer}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <h4 class="font-bold text-lg flex items-center gap-2"><i class="fa-solid fa-list text-gray-400"></i> Changelog</h4>
                    ${changelogHtml}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <a href="${buildInfo.download}" class="bg-brand hover:opacity-80 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-brand-900/50 text-center col-span-1 md:col-span-2">
                        <i class="fa-solid fa-download text-xl"></i> Download ROM
                    </a>
                    
                    <a href="${buildInfo.recovery}" class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-700">
                        <i class="fa-solid fa-life-ring"></i> Get Recovery
                    </a>
                    <a href="${buildInfo.forum}" target="_blank" class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-700">
                        <i class="fa-brands fa-discourse"></i> XDA Thread
                    </a>
                </div>
                
                <div class="text-center pt-4 border-t border-gray-800 mt-6">
                    <a href="${buildInfo.paypal}" target="_blank" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <i class="fa-solid fa-heart text-red-500"></i> Support the maintainer
                    </a>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching details:', error);
            bodyEl.innerHTML = `
                <div class="bg-red-900/20 border border-red-900 text-red-400 p-6 rounded-xl flex items-start gap-4">
                    <i class="fa-solid fa-triangle-exclamation text-2xl mt-1"></i>
                    <div>
                        <h4 class="font-bold mb-1">Failed to load device info</h4>
                        <p class="text-sm text-red-400/80">There was an error connecting to the OTA server. Please try again later.</p>
                        <p class="text-xs text-red-400/60 mt-2 font-mono">${error.message}</p>
                    </div>
                </div>
            `;
        }
    };

    const closeModal = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('modal-active');
    };

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });
});
