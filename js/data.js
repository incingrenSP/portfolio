
const portfolioData = {
    about: {
        title: "About Me",
        images: [
            "assets/images/profile/profile.jpg"
        ],
        content: `
            <p>Hello! My name is Samir Pokharel. I have a degree in Bachelor's in Computer Engineering, 2026 from Tribhuvan University.</p>
            
            <p>I have a specialization in AI/ML and Data Science. I also have a keen interest in 3D modeling and game/software development.</p>
            
            <p>When I'm not coding, I like to draw, and play video games. I'm also a casual reader who enjoys philosophy 
            and a good story</p>
        `
    },

    projects: [
        {
            name: "AI-driven Subtitle Generation using Self-Supervised Learning",
            language: "Python/Jupyter",
            github: "https://github.com/incingrensp/ssl_subs_generation",
            images: [
                "assets/images/project-1/ssl_asr_1.png",
                "assets/images/project-1/ssl_asr_2.png"
            ],
            description: "A transcript generative model trained on Nepali speech dataset using self-supervised learning paradigm."
        },
        {
            name: "Play2Code: Learn C++ While Playing Games",
            language: "Python/GDScript",
            github: "https://github.com/incingrensp/",
            images: [
                "assets/images/project-2/p2c_1.png",
                "assets/images/project-2/p2c_2.png"
            ],
            description: "A 2D game developed in Godot Engine as submission project for Hackathon."
        },
        {
            name: "Comparative Analysis of Pneumonia Detection Models using Fast Fourier Transform",
            language: "Python/Jupyter",
            github: "https://github.com/incingrensp/fft_cnn",
            images: [
                "assets/images/project-3/fft_1.png",
                "assets/images/project-3/fft_2.png",
                "assets/images/project-3/fft_3.png"
            ],
            description: "A pneumonia detection model analysis that uses modified AlexNet and InceptionV1 to use FFT to improve base performance."
        },
        {
            name: "Zelda-inspired RPG Game",
            language: "Python/PyGame",
            github: "https://github.com/incingrensp/cg-project",
            images: [
                "assets/images/project-4/rpg_1.png",
                "assets/images/project-4/rpg_2.png",
                "assets/images/project-4/rpg_3.png",
                "assets/images/project-4/rpg_4.png",
                "assets/images/project-4/rpg_5.png"
            ],
            description: "An adventure role-playing game developed using PyGame."
        },
        {
            name: "Online Shop System",
            language: "C++",
            github: "https://github.com/incingrensp/online_shop",
            images: [  // ← Can have just one image too
                "assets/images/project-5/online_shop_1.png",
                "assets/images/project-5/online_shop_2.png",
                "assets/images/project-5/online_shop_3.png",
                "assets/images/project-5/online_shop_4.png",
                "assets/images/project-5/online_shop_5.png"
            ],
            description: "A simple digital shopping system developed in C++."
        },
        {
            name: "Portfolio Website",
            language: "HTML/CSS/JavaScript",
            github: "https://github.com/incingrensp/portfolio",
            images: [
                "assets/images/project-6/port_1.png",
                "assets/images/project-6/port_2.png",
                "assets/images/project-6/port_3.png",
                "assets/images/project-6/port_4.png",
            ],
            description: "Animated portfolio website using HTML, CSS, and JavaScript"
        },
    ],

    certifications: [
        {
            name: "PROTOBYTES Hackathon 2.0",
            images: [
                "assets/images/certificates/cert-1.jpg"
            ],
            description: "A participation award for joining 60-hour hackathon in Advanced College of Engineering and Management."
        },
        {
            name: "Hamrobazaar Student Partnership Program",
            images: [
                "assets/images/certificates/cert-2.png"
            ],
            description: "An award for seminar participation on partnership program about how Hamrobazaar started and is continuing in Nepal."
        },
        {
            name: "Aarambha 2024 PROTOBYTES (Hackathon)",
            images: [
                "assets/images/certificates/cert-3.png"
            ],
            description: "A participation award for joining 35-hour hackathon in Advanced College of Engineering and Management."
        },
    ],

    contact: {
        email: "samirpokharel002@gmail.com",
        github: "https://github.com/incingrensp",
        linkedin: "https://www.linkedin.com/in/samir-pokharel-551734364/"
    },

    cv: {
        pdfUrl: "assets/cv.pdf"
    }
};