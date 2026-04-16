// --- 1. ENGINE 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(3000 * 3);
for(let i=0; i<9000; i++) starPos[i] = (Math.random()-0.5)*25;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);
camera.position.z = 5;

const flowers = [];
function createFlower(pos) {
    const geo = new THREE.TorusKnotGeometry(0.1, 0.03, 64, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff758c, transparent: true });
    const f = new THREE.Mesh(geo, mat);
    f.position.copy(pos);
    f.userData = { vel: new THREE.Vector3((Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08), life: 1.0 };
    scene.add(f); flowers.push(f);
}

window.addEventListener('mousedown', (e) => {
    const vec = new THREE.Vector3((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1, 0.5).unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    createFlower(camera.position.clone().add(dir.multiplyScalar(5)));
});

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0003;
    flowers.forEach((f, i) => {
        f.position.add(f.userData.vel); f.userData.life -= 0.015; f.material.opacity = f.userData.life;
        if(f.userData.life <= 0) { scene.remove(f); flowers.splice(i, 1); }
    });
    renderer.render(scene, camera);
}
animate();

// --- 2. LOGIKA KONTEN ---
const audio = document.getElementById('bg-music');
const PASS = "1810";
let step = 0;

const pages = [
    { t: "Bypass Success!", c: "Mencari subjek paling berharga di semesta ini...", b: "Mulai" },
    { t: "Found It!", c: "Ternyata itu kamu. Galaksi terindah yang pernah aku temukan.", b: "Lanjut" },
    { type: "photo", t: "Always You", c: "I love you to the moon and back.", img: "P.jpeg" }
];

function validate() {
    const input = document.getElementById('pass-input').value;
    if(input === PASS) {
        audio.play().catch(() => console.log("Musik tertunda"));
        document.getElementById('lock-screen').classList.add('hidden');
        const mainUI = document.getElementById('main-ui');
        mainUI.classList.remove('hidden');
        mainUI.style.opacity = 1;
        showPage();
    } else {
        document.getElementById('error-txt').classList.remove('hidden');
    }
}

function showPage() {
    const div = document.getElementById('dynamic-content');
    const p = pages[step];
    
    div.style.opacity = 0;
    setTimeout(() => {
        if (p.type === "photo") {
            div.innerHTML = `
                <div class="photo-frame"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/230x280?text=Cek+Nama+File'"></div>
                <h1 class="main-title">${p.t}</h1>
                <p class="quote">${p.c}</p>
                <button class="next-btn" onclick="location.reload()">Selesai ❤️</button>`;
        } else {
            div.innerHTML = `
                <h1 class="main-title">${p.t}</h1>
                <p class="quote">${p.c}</p>
                <button class="next-btn" onclick="next()"> ${p.b} </button>`;
        }
        div.style.opacity = 1;
    }, 300);
}

function next() {
    if (step < pages.length - 1) {
        step++;
        showPage();
    }
}