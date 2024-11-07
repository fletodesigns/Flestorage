import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeRI0bjkGyIFm70maB6cUM41EhXtqVbYo",
    authDomain: "fledrive.firebaseapp.com",
    projectId: "fledrive",
    storageBucket: "fledrive.appspot.com",
    messagingSenderId: "136266669764",
    appId: "1:136266669764:web:62c15a98af3a3b4c4f3391",
    measurementId: "G-JELKRYCFEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

// Select buttons
const addFolderBtn = document.getElementById('addFolderBtn');
const addFileBtn = document.getElementById('addFileBtn');
const foldersSection = document.querySelector('.folders-section');

// Add folder functionality
addFolderBtn.addEventListener('click', () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        // Create folder in Firebase
        const folderRef = dbRef(db, `folders/${folderName}`);
        set(folderRef, { createdAt: Date.now() })
        .then(() => {
            // Create folder card in UI
            const folderCard = document.createElement('div');
            folderCard.classList.add('folder-card');
            folderCard.innerHTML = `
                <div class="folder-icon">
                    <img src="https://flestorage.netlify.app/img/folder-icon.png" alt="Folder Icon">
                </div>
                <div class="folder-details">
                    <p>${folderName}</p>
                </div>
                <div class="folder-actions">
                    <button class="action-btn">⬇️</button>
                    <button class="action-btn">📋</button>
                    <button class="action-btn">⋮</button>
                </div>
            `;
            foldersSection.appendChild(folderCard);
            alert(`Folder '${folderName}' created!`);
        })
        .catch(err => console.error('Error creating folder:', err));
    }
});

// Upload file functionality
addFileBtn.addEventListener('click', () => {
    const folderName = prompt('Enter the folder name to upload the file to:');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file && folderName) {
            const fileRef = ref(storage, `files/${folderName}/${file.name}`);
            uploadBytes(fileRef, file)
                .then(snapshot => {
                    getDownloadURL(snapshot.ref).then(downloadURL => {
                        const fileMetaRef = dbRef(db, `folders/${folderName}/files/${file.name}`);
                        set(fileMetaRef, {
                            name: file.name,
                            url: downloadURL,
                            uploadedAt: Date.now()
                        });
                        alert('File uploaded successfully!');
                    });
                })
                .catch(error => console.error('File upload failed:', error));
        }
    };
    fileInput.click();
});
