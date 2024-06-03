document.getElementById('uploadButton').addEventListener('click', handleFileUpload);
document.getElementById('saveButton').addEventListener('click', saveCombinedCSV);

let combinedData = [];
const maxFileSize = 10 * 1024 * 1024; // 10 MB

function handleFileUpload() {
    const input = document.getElementById('fileInput');
    const files = input.files;

    if (files.length === 0) {
        alert('Please select at least one CSV file.');
        return;
    }

    let totalSize = 0;
    for (const file of files) {
        totalSize += file.size;
        if (file.type !== 'text/csv') {
            alert(`File ${file.name} is not a CSV file.`);
            return;
        }
    }

    if (totalSize > maxFileSize) {
        alert('Total file size exceeds the 10MB limit.');
        return;
    }

    combinedData = [];
    const promises = [];

    for (const file of files) {
        const reader = new FileReader();
        promises.push(new Promise((resolve) => {
            reader.onload = function (e) {
                const text = e.target.result;
                const rows = text.split('\n').filter(row => row.trim() !== '').map(row => row.split(','));
                if (combinedData.length === 0) {
                    combinedData = rows;
                } else {
                    combinedData = combinedData.concat(rows.slice(1));
                }
                resolve();
            };
            reader.readAsText(file);
        }));
    }

    Promise.all(promises).then(() => {
        alert('Files have been successfully uploaded and combined.');
        document.getElementById('output').style.display = 'block';
    });
}

function saveCombinedCSV() {
    const fileName = document.getElementById('fileNameInput').value;
    const csvContent = combinedData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Reset input and hide output elements
    document.getElementById('fileInput').value = '';
    document.getElementById('output').style.display = 'none';
    combinedData = [];
}
