const elements = {
    name: document.getElementById('name'),
    title: document.getElementById('title'),
    bio: document.getElementById('bio'),
    skills: document.getElementById('skills'),
    projects: document.getElementById('projects'),
    github: document.getElementById('github'),
    linkedin: document.getElementById('linkedin'),
    twitter: document.getElementById('twitter'),
    profilePic: document.getElementById('profilePic'),

    previewName: document.getElementById('preview-name'),
    previewTitle: document.getElementById('preview-title'),
    previewBio: document.getElementById('preview-bio'),
    previewSkills: document.getElementById('preview-skills'),
    previewProjects: document.getElementById('preview-projects'),
    previewImage: document.getElementById('preview-image'),
    socialLinks: document.getElementById('socialLinks'),
};

function updatePreview() {
    elements.previewName.textContent = elements.name.value || "Your Name";
    elements.previewTitle.textContent = elements.title.value || "Your Title";
    elements.previewBio.textContent = elements.bio.value || "Your bio goes here.";

    // Skills
    const skills = elements.skills.value.split(',').map(s => s.trim()).filter(Boolean);
    elements.previewSkills.innerHTML = '';
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        elements.previewSkills.appendChild(li);
    });

    // Projects
    const projects = elements.projects.value.split('\n').filter(Boolean);
    elements.previewProjects.innerHTML = '';
    projects.forEach(project => {
        const [title, link] = project.split('-').map(p => p.trim());
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link || "#";
        a.textContent = title;
        a.target = "_blank";
        a.style.color = "#4fc3f7";
        li.appendChild(a);
        elements.previewProjects.appendChild(li);
    });

    // Social Icons
    const icons = {
        github: "fab fa-github",
        linkedin: "fab fa-linkedin",
        twitter: "fab fa-twitter",
    };

    elements.socialLinks.innerHTML = '';
    ['github', 'linkedin', 'twitter'].forEach(site => {
        const url = elements[site].value.trim();
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.target = "_blank";
            a.innerHTML = `<i class="${icons[site]}"></i>`;
            elements.socialLinks.appendChild(a);
        }
    });
}

function handleImageUpload() {
    const file = elements.profilePic.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            elements.previewImage.src = e.target.result;
            elements.previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
});

Object.values(elements).forEach(el => {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.addEventListener('input', updatePreview);
    }
});
elements.profilePic.addEventListener('change', handleImageUpload);

updatePreview(); // Initial call

// Export ZIP
document.getElementById('downloadZip').addEventListener('click', () => {
    const zip = new JSZip();

    const profileImg = elements.previewImage.src;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${elements.name.value}'s Portfolio</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <button id="themeToggle">🌙 Toggle Theme</button>

  <div class="container">
    <div class="portfolio">
      <img src="assets/profile.jpg" class="profile-img" />
      <h1>${elements.name.value}</h1>
      <h3>${elements.title.value}</h3>
      <p>${elements.bio.value}</p>
      <h4>Skills</h4>
      <ul>${skills.value.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}</ul>
      <h4>Projects</h4>
      <ul>${projects.value.split('\n').map(p => {
        const [t, l] = p.split('-').map(x => x.trim());
        return `<li><a href="${l}" target="_blank">${t}</a></li>`;
    }).join('')}</ul>
      <h4>Follow Me</h4>
      <div class="social-icons">
        ${elements.github.value ? `<a href="${elements.github.value}"><i class="fab fa-github"></i></a>` : ''}
        ${elements.linkedin.value ? `<a href="${elements.linkedin.value}"><i class="fab fa-linkedin"></i></a>` : ''}
        ${elements.twitter.value ? `<a href="${elements.twitter.value}"><i class="fab fa-twitter"></i></a>` : ''}
      </div>
    </div>
  </div>
  <!----- js file linked ---->
  <script src="app.js" defer></script>
</body>
</html>`.trim();

    const css = `
  :root {
  --bg: #1c1c1c;
  --text: #fff;
  --accent: #ffa500;
}

body.light {
  --bg: #f0f0f0;
  --text: #111;
  --accent: #0055ff;
}

body {
  font-family: "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
  margin: 0;
  padding: 20px;
  transition: background 0.3s, color 0.3s;
}
  button {
  padding: 10px 20px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  margin-top: 15px;
}

h2, h3, h4 {
  color: var(--accent);
}

ul {
  list-style: none;
  padding-left: 15px;
}

ul li::before {
  content: "✅ ";
}

.profile-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 15px;
}

.social-icons a {
  margin-right: 10px;
  font-size: 1.5rem;
  color: var(--accent);
  text-decoration: none;
}

#themeToggle {
  position: fixed;
  top: 15px;
  right: 15px;
  padding: 8px 15px;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
}`;

    const js = `document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});`;

    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("app.js", js);

    const imageFile = elements.profilePic.files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = e => {
            zip.folder("assets").file("profile.jpg", e.target.result.split(',')[1], { base64: true });

            zip.generateAsync({ type: "blob" }).then(content => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(content);
                a.download = `${elements.name.value}'s portfolio.zip`;
                a.click();
            });
        };
        reader.readAsDataURL(imageFile);
    } else {
        // No profile image, generate ZIP directly
        zip.generateAsync({ type: "blob" }).then(content => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `${elements.name.value}'s portfolio.zip`;
            a.click();
        });
    }
});