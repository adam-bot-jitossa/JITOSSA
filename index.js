
// ======================================================
// JITOSSA BOT v1.0.0
// Copyright © 2026 adam - جميع الحقوق محفوظة
// بوت واتساب متعدد الأجهزة مبني بـ Baileys
// ======================================================

console.log('🐾 جاري تشغيل JITOSSA BOT...');

import { Worker } from 'worker_threads';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile } from 'fs';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rl = readline.createInterface(process.stdin, process.stdout);

let worker = null;
let running = false;
let restartTimer = null;

/**
 * دالة تشغيل البوت
 * @param {string} file - اسم الملف المراد تشغيله
 */
function start(file) {
	if (running) return;
	running = true;
	const full = join(__dirname, file);

	if (worker) worker.terminate();
	worker = new Worker(full);
	
	if (restartTimer) {
		clearTimeout(restartTimer);
	restartTimer = null;
	}

	// الاستماع للرسائل من الـ worker
	worker.on('message', (msg) => {
		console.log('[رسالة]', msg);

		if (msg === 'restart' || msg === 'reset') {
			restart();
	}
	});

	// عند توقف الـ worker
	worker.on('exit', (code) => {
		console.log('❗ توقف العامل بكود:', code);
	running = false;
		
		// إعادة التشغيل التلقائي في حالة حدوث خطأ
		if (code !== 0) {
			console.log('⏳ سيتم إعادة التشغيل تلقائياً بعد 30 ثانية...');
			restartTimer = setTimeout(
				() => {
					restart();
				},
				30 * 1000 // 30 ثانية
			);
		}

		// مراقبة الملف وإعادة التشغيل عند التعديل
		watchFile(full, () => {
			unwatchFile(full);
			console.log('♻️ تم تعديل الملف → جاري إعادة التشغيل...');
			start(file);
		});
	});

	// الاستماع لأوامر الكونسول
	if (!rl.listenerCount('line')) {
		rl.on('line', (line) => {
			const cmd = line.trim().toLowerCase();
			if (!cmd) return;

			if (cmd === 'exit' || cmd === 'خروج') {
				console.log('⛔ جاري إيقاف JITOSSA BOT...');
				worker?.terminate();
				process.exit(0);
			}
			if (cmd === 'restart' || cmd === 'reset' || cmd === 'اعادة') {
				console.log('🍃 جاري إعادة التشغيل...');
				restart();
			}

			worker?.postMessage(cmd);
	});
	}
}

/**
 * دالة إعادة التشغيل
 */
function restart() {
	if (worker) {
		try {
			worker.terminate();
		} catch {}
	}
	running = false;
	start('main.js');
}

// بدء التشغيل
start('main.js');
