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
        threshold: 0.3, // Déclenche quand 30% de la section est visible
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