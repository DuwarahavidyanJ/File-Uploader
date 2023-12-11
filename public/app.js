// app.js

document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
});

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadFiles();
    })
    .catch(error => console.error('Error:', error));
}

function loadFiles() {
    fetch('/files')
    .then(response => response.json())
    .then(files => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        files.forEach(file => {
            const listItem = document.createElement('div');
            listItem.innerHTML = `
                <span>${file.filename}</span>
                <button onclick="downloadFile(${file.id})">Download</button>
                <button onclick="deleteFile(${file.id})">Delete</button>
            `;
            fileList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
}

function downloadFile(id) {
    window.location.href = `/download/${id}`;
}

function deleteFile(id) {
    fetch(`/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadFiles();
    })
    .catch(error => console.error('Error:', error));
}
