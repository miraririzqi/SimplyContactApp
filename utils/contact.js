const fs = require('fs');

//membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

//membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}
//ambil smeua data contact di json
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
}

//cari contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase());
        return contact;
};

//menuliskan file contacts json dengan data baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}


//menambhakan data contact baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);

    // setTimeout(console.log('ganti warna'), 4000);
}

const updateRow = () => {
    // const contacts = loadContact();
    // const lastContact = contacts.length-1;
    // const barisContact = document.querySelector('#' + lastContact);
    // barisContact.className = 'success';
    
    console.log('ganti warna');
}

//cek nama duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
};

//hapus contact
const deleteContact = (nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
    console.log(filteredContacts);
    saveContacts(filteredContacts);
};


// uba contact
const updateContacts = (contactBaru) => {
    const contacts = loadContact();

    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
    // console.log(filteredContacts, contactBaru);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}

module.exports= { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };