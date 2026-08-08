export const projects =
    {
            "swagaria":
                {
                        title: "Swagaria",
                        subtitle: "Unity 2D Sandbox Game",
                        role: "Solo Developer",
                        summary: "A Unity-based 2D sandbox game inspired by Terraria, focusing on cleanly designed architectures and optimisation.",
                        description: "A Unity-based 2D sandbox game inspired by Terraria, focusing on cleanly designed architectures and optimisation.",
                        highlights: [],
                        tags: ["C#", "Unity", "HLSL", "Sandbox", "Procedural Generation"],
                        images: ["assets/swagaria/swagaria1.png", "assets/swagaria/swagaria2.png", "assets/swagaria/swagaria3.gif"],
                        website: "https://github.com/swagward/Swagaria-v4",
                        video: null
                },
            "camp-siege":
                {
                        title: "Camp Siege",
                        subtitle: "Fast Paced Tower Defense",
                        role: "Solo Developer",
                        summary: "A fast-paced tower defense made in Unreal Engine 5.",
                        description: "An endless fast-paced tower defense game built in Unreal Engine 5, inspired by Dungeon Defenders.",
                        highlights: [],
                        tags: ["Unreal 5", "Blueprints", "C++"],
                        images: ["assets/campsiege/campsiege1.png", "assets/campsiege/campsiege2.png"],
                        website: "https://github.com/swagward/Camp-Siege",
                        video: null
                },
            "crystal-defenders":
                {
                        title: "Crystal Defenders",
                        subtitle: "Fast Paced Tower Defense",
                        role: "Solo Developer",
                        summary: "Similar to Camp Siege, but made in JavaScript with Phaser to play in browsers.",
                        description: "Similar to Camp Siege, but made in JavaScript with Phaser to play in browsers.",
                        highlights: [],
                        tags: ["JavaScript", "Phaser 2", "Desktop only"],
                        images: ["assets/crystaldefenders/crystaldefenders1.png", "assets/crystaldefenders/crystaldefenders2.png"],
                        website: "game.html",
                        video: null
                },
            "fnan":
                {
                        title: "Five Nights at Naughtys",
                        subtitle: "Group Hobby Project",
                        role: "Primary Programmer",
                        summary: "A group college project inspired by Five Nights at Freddy's.",
                        description: "A group project inspired by Five Nights at Freddy's. I was responsible for the core AI logic, security camera systems, and game state management within Unity.",
                        highlights: [],
                        tags: ["Unity", "C#", "Horror"],
                        images: ["assets/fnan/fnan1.gif", "assets/fnan/fnan2.png", "assets/fnan/fnan3.png"],
                        website: "https://naughty-corner-games.itch.io/five-nights-at-naughtys",
                        video: "https://www.youtube.com/embed/R-ZTeeAXC9o"
                },
            "swagaria-multiplayer":
                {
                        title: "Swagaria Multiplayer",
                        subtitle: "Cross-Language Networking Project",
                        role: "Solo Developer",
                        summary: "A multiplayer remake of Swagaria, built for a uni project using C++ for client-side rendering and input handling and Java for authoritative server control over the world and player state.",
                        description: "A complex technical remake of Swagaria featuring authoritative server control. Built using C++ for high-performance client-side rendering and Java for the backend server to manage world state and player synchronization.",
                        highlights: ["Split the codebase across two languages by responsibility: a C++ client handling real-time rendering and input, and a Java server acting as the sole authority over world and player state.", "Server-authoritative architecture prevents client-side manipulation of game state — the client only renders what the server confirms, rather than simulating its own outcomes.", "Custom networking layer over SDL2 handles state synchronization between client and server, built without a third-party networking framework."],
                        tags: ["C++", "Java", "SDL2", "Networking"],
                        images: [],
                        website: "https://github.com/swagward/SwagariaMultiplayer",
                        video: "https://www.youtube.com/embed/ezAafmcUHzs"
                },
            "party-playgrounds":
                {
                    title: "Party Playgrounds",
                    subtitle: "Cross-Language Networking Project",
                    role: "Solo Developer",
                    summary: "A multiplayer remake of Swagaria, built for a uni project using C++ for client-side rendering and input handling and Java for authoritative server control over the world and player state.",
                    description: "A complex technical remake of Swagaria featuring authoritative server control. Built using C++ for high-performance client-side rendering and Java for the backend server to manage world state and player synchronization.",
                    highlights: ["Split the codebase across two languages by responsibility: a C++ client handling real-time rendering and input, and a Java server acting as the sole authority over world and player state.", "Server-authoritative architecture prevents client-side manipulation of game state — the client only renders what the server confirms, rather than simulating its own outcomes.", "Custom networking layer over SDL2 handles state synchronization between client and server, built without a third-party networking framework."],
                    tags: ["C#", "Unity", "Steamworks", "Mirror"],
                    images: [],
                    website: "https://github.com/swagward/SwagariaMultiplayer",
                    video: "https://www.youtube.com/embed/ezAafmcUHzs"
                }
    }