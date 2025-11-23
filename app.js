const fs = require('fs');
const path = require('path');
const readline = require('readline');
const validator = require('validator');
const chalk = require('chalk');

const rl = readline.createInterface({   
    input: process.stdin,
    output: process.stdout
});






function mainMenu() {
    console.log(chalk.cyan('\nSelamat Datang di Contact App!'));
    console.log(chalk.cyan('\n=== MENU ==='));
    console.log('1. Tambah Kontak');
    console.log('2. Lihat Semua Kontak');
    console.log('3. Keluar\n');

    rl.question('Pilih menu (1/2/3): ', (menu) => {
        if (menu === '1') {
            askInput();
        } else if (menu === '2') {
            showContacts();
        } else if (menu === '3') {
            console.log(chalk.green('Terimakasih!'));
            rl.close();
        } else {
            console.log(chalk.red('Pilihan tidak valid.'));
            mainMenu();
        }
    });
}






// Membuat fungsi input berulang
function askInput() {
    rl.question(chalk.yellow('masukkan nama anda : '), (nama) => {
        rl.question(chalk.yellow('masukkan no hp anda : '), (noHp) => {

            // CEK APAKAH INPUT KOSONG
            if (validator.isEmpty(nama) || validator.isEmpty(noHp)) {
                console.log(chalk.red('Input tidak boleh kosong!, coba lagi'));
                return askInput(); // ULANG
            }

            // cek apakah input no hp itu benar
            if (!validator.isMobilePhone(noHp, 'id-ID')) {
                console.log(chalk.red('Nomor HP tidak valid (format Indonesia), coba lagi.\n'));
                return askInput(); // ULANG
            }

            // CEK NAMA DUPLIKAT
            

            
            const contact = { 
                nama,
                noHp,
                createdAt: new Date().toISOString()
            };

            // path folder dan file
            const dirPath = path.join(__dirname, 'data');
            const filePath = path.join(dirPath, 'contact.json');

            // cek folder, kalau tidak ada -> buat
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // cek file JSON, kalau tidak ada, buat file kosong berisi array []
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '[]', 'utf-8');
            }

            // baca file JSON
            const file = fs.readFileSync(filePath, 'utf-8');
            const contacts = JSON.parse(file);
            

            // CEK APAKAH NAMA SUDAH ADA
            const isDuplicate = contacts.find(
                (c) => c.nama.toLowerCase() === nama.toLowerCase()
            );

            if (isDuplicate) {
                console.log(chalk.red('Nama sudah terdaftar, coba masukkan nama lain.\n'));
                return askInput(); 
            }



            // tambah kontak baru
            contacts.push(contact);

            // simpan kembali
            fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

            console.log(chalk.green('Kontak berhasil disimpan!'));
            return mainMenu();
        });
    });
}





function showContacts() {
    const dirPath = path.join(__dirname, 'data');
    const filePath = path.join(dirPath, 'contact.json');

    // jika folder/file belum ada → bikin
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf-8');
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const contacts = JSON.parse(file);

    console.log(chalk.blue('\n=== Daftar Kontak ==='));

    if (contacts.length === 0) {
        console.log(chalk.yellow('Belum ada kontak yang tersimpan.'));
    } else {
        contacts.forEach((c, i) => {
            console.log(chalk.green(`${i + 1}. ${c.nama} - ${c.noHp}`));
        });
    }

    console.log(); // enter
    mainMenu(); // kembali ke menu
}




console.log(chalk.blue('=== Contact App ==='));
mainMenu();




