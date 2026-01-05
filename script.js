document.addEventListener("DOMContentLoaded", () => {



    // ==============================================
    // 0. CONFIGURATION DU TITRE CINTRÉ
    // Modifie ces valeurs pour ajuster la forme !
    // ==============================================
    const titreConfig = {
        courbure: 180,      // Plus le chiffre est grand, plus l'arche est pointue (0 = plat)
        espacement: 60,    // Espace vertical entre chaque ligne
        departY: 120,      // Position verticale de la première ligne (haut du bloc)
        largeur: 1000,     // Largeur de référence (ne pas toucher sauf si on change le viewBox HTML)
        margeX: 50         // Marge gauche/droite pour que le texte ne touche pas les bords
    };

    function dessinerCourbes() {
        const { courbure, espacement, departY, largeur, margeX } = titreConfig;
        const centreX = largeur / 2;
        const finX = largeur - margeX;

        // Fonction mathématique pour générer le code SVG "d"
        // M = Départ, Q = Courbe (Control Point, Arrivée)
        const genererChemin = (y) => {
            // Le point de contrôle est au milieu (X) et plus haut que la ligne (Y - courbure)
            return `M ${margeX} ${y} Q ${centreX} ${y - courbure} ${finX} ${y}`;
        };

        // On applique le calcul aux 3 lignes
        document.getElementById('pathLine1').setAttribute('d', genererChemin(departY));
        document.getElementById('pathLine2').setAttribute('d', genererChemin(departY + espacement));
        document.getElementById('pathLine3').setAttribute('d', genererChemin(departY + (espacement * 2)));
    }

    // On lance le dessin
    dessinerCourbes();



    
    // ==============================================
    // 1. CHANGEMENT DE COULEUR AU SCROLL
    // Gère la couleur de fond en fonction de la section
    // ==============================================

    const sections = document.querySelectorAll("section, header, footer");
    
    const options = {
        root: null, // Par rapport à la fenêtre
        threshold: 0.2, // Déclenche quand 30% de la section est visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Récupère l'attribut data-theme HTML
                const theme = entry.target.getAttribute("data-theme");
                
                if (theme) {
                    // Nettoie les anciennes classes et ajoute la nouvelle
                    document.body.className = document.body.className
                        .replace(/\btheme-\S+/g, "")
                        .trim();
                    
                    document.body.classList.add(`theme-${theme}`);
                }
            }
        });
    }, options);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // ==============================================
    // 2. MENU BURGER (MOBILE)
    // Gère l'ouverture/fermeture et l'animation croix
    // ==============================================

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.menu');
    const navLinks = document.querySelectorAll('.menu li');

    if(burger){
        burger.addEventListener('click', () => {
            // Bascule l'affichage du menu
            nav.classList.toggle('nav-active');
            
            // Bascule l'animation du bouton (lignes -> croix)
            burger.classList.toggle('toggle');
        });
        
        // Ferme le menu automatiquement quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }

    // ==============================================
    // 4. EFFET ÉTOILES CONTINU (HOVER)
    // ==============================================
    
    const logo = document.querySelector('.hero-image');
    let starInterval; // Pour stocker le chronomètre

    if (logo) {
        // QUAND LA SOURIS ENTRE : On lance la machine
        logo.addEventListener('mouseenter', () => {
            starInterval = setInterval(() => {
                creerEtoile();
            }, 10); // Une étoile toutes les 10ms (Réduis ce chiffre pour plus d'étoiles)
        });

        // QUAND LA SOURIS SORT : On coupe le moteur
        logo.addEventListener('mouseleave', () => {
            clearInterval(starInterval);
        });
    }

    // La fonction qui fabrique une seule étoile
    function creerEtoile() {
        const star = document.createElement('div');
        star.classList.add('magic-star');
        star.innerHTML = '★'; 
        
        // 1. Centre du logo
        const rect = logo.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + (rect.width / 2);
        const centerY = rect.top + window.scrollY + (rect.height / 2);

        // 2. Position de départ (Centre + léger hasard)
        const randomOffset = 20; 
        star.style.left = (centerX + (Math.random() - 0.5) * randomOffset) + 'px';
        star.style.top = (centerY + (Math.random() - 0.5) * randomOffset) + 'px';

        // 3. Direction
        const x = (Math.random() - 0.5) * 800 + 'px';
        const y = (Math.random() - 0.5) * 800 + 'px';
        
        star.style.setProperty('--tx', x);
        star.style.setProperty('--ty', y);

        // 4. Style
        const size = Math.random() * 20 + 10;
        star.style.fontSize = size + 'px';
        star.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(star);

        setTimeout(() => { star.remove(); }, 1200);
    }
});


// ==============================================
// 3. FIX : EMPÊCHER LE FLASH DU MENU AU REDIMENSIONNEMENT
// Coupe les animations quand on change la taille de l'écran
// ==============================================
let resizeTimer;
window.addEventListener("resize", () => {
    // On ajoute la classe qui tue les transitions
    document.body.classList.add("resize-animation-stopper");
    
    // On efface le timer précédent s'il y en a un
    clearTimeout(resizeTimer);
    
    // On relance un timer : si on arrête de redimensionner pendant 400ms,
    // on réactive les animations.
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
    }, 400);
});