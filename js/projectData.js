export const projects =
    {
            "swagaria":
                {
                        title: "Swagaria",
                        subtitle: "Unity 2D Sandbox Game",
                        role: "Solo Developer",
                        summary: "A Unity-based 2D sandbox game inspired by Terraria, focusing on cleanly designed architectures and optimisation.",
                        description: "A Unity-based 2D sandbox game inspired by Terraria, focusing on cleanly designed architectures and optimisation.",
                        highlights: ["Went through three different tile-rendering approaches over several iterations spanning 4 years, individual sprite objects per tile, then Unity's Tilemap system, then optimised custom meshes  to cut triangle and vertex counts.",
                                     "Eventually identified Unity's own engine as the primary bottleneck, which directly motivated rebuilding the project from scratch in C++ for Swagaria Multiplayer."],
                        tags: ["C#", "Unity", "HLSL", "Sandbox", "Procedural Generation"],
                        images: ["assets/swagaria/swagaria1.png", "assets/swagaria/swagaria2.png", "assets/swagaria/swagaria3.gif"],
                        website: "https://github.com/swagward/Swagaria-v4",
                        video: null
                },
            "camp-siege":
                {
                        title: "Camp Siege",
                        subtitle: "Fast Paced Survival Shooter",
                        role: "Solo Developer",
                        summary: "A fast-paced survival shooter made in Unreal Engine 5.",
                        description: "An endless fast-paced survival shooter game built in Unreal Engine 5, inspired by Dungeon Defenders.",
                        highlights: ["Built entirely with Blueprints, my first hands-on project with Unreal's visual scripting, using the Enhanced Input System, and NavMesh-driven AI.",
                                     "Enemies use a NavMesh chase system built on a Pawn Sensing Component, primarily targeting the home-bases crystal, deviating to attack the player if they get in range.",
                                     "Damage detection uses per-tick raycasts from the enemies view rather than simple triggers, for precise control over when an attack lands."],
                        tags: ["Unreal 5", "Blueprints"],
                        images: ["assets/campsiege/campsiege1.png", "assets/campsiege/campsiege2.png"],
                        website: "https://github.com/swagward/Camp-Siege",
                        video: null
                },
            "crystal-defenders":
                {
                        title: "Crystal Defenders",
                        subtitle: "Fast Paced Survival Shooter",
                        role: "Solo Developer",
                        summary: "A top-down 2D survival shooter defending a crystal from waves of enemies, made with JavaScript and Phaser 2.",
                        description: "Similar to Camp Siege, but made in JavaScript with Phaser to play in browsers.",
                        highlights: ["Enemy pathfinding uses EasyStar.js (A*) over a grid derived from the Tiled Editor, dynamically switching targets between the player and the crystal based on proximity.",
                                     "Enemy counts and speed scale as waves go on, by round 25 there are 50+ enemies moving more than twice as fast as round 1.",
                                     "Ammo is scarce by design, enemies only have a 33% chance to drop it on death, forcing resource management over spamming attacks repeatedly."],
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
                        highlights: ["First project working as part of a team, and my first time as the primary programmer, built the core systems (AI, camera, save/load) that the rest of the team relied upon.",
                                     "Enemy movement runs on a timer, with each location holding a fixed set of valid points the enemy could move to next, rather than free-roaming pathfinding, to keep the enemy seamlessly wandering around instead of teleporting between distant points.",
                                     "Built a night cycle where the enemy scales in difficulty each night, though only 2 nights made it to the demo release however the underlying system supports up to 5 nights."],
                        tags: ["Unity", "C#", "Horror"],
                        images: ["assets/fnan/fnan2.png", "assets/fnan/fnan1.gif", "assets/fnan/fnan3.png"],
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
                        highlights: ["Split the codebase across two languages by responsibility: a C++ client handling real-time rendering and input, and a Java server acting as the sole authority over player and world state.",
                                     "Tiles are defined through a data-driven component registry (collision, durability, required tool) rather than inheritance, replacing the approach used in previous Unity iterations, and making new tile types a one line addition.",
                                     "Chunk based world streaming plus frustum culling reached up to 4,000 frames per second during testing on a 65,000 tile world, deliberately stress-testing the application to see the 'worst case' scenarios.",
                                     "Uses client-side prediction with server reconciliation over TCP: the client moves immediately for player responsiveness, then smoothly interpolates to the server's authoritative position if theres ever a disagreement."],
                        tags: ["C++", "Java", "SDL2", "Networking"],
                        images: ["assets/swagaria/swagariaMultiplayer.png"],
                        website: "https://github.com/swagward/SwagariaMultiplayer",
                        video: "https://www.youtube.com/embed/ezAafmcUHzs"
                },
            "party-playgrounds":
                {
                    title: "Party Playgrounds",
                    subtitle: "Modular P2P Multiplayer Framework",
                    role: "Solo Developer",
                    summary: "A modular peer-to-peer multiplayer party game framework built in Unity, using Mirror and the Steamworks API to remove the cost and complexity of dedicated server hosting.",
                    description: "A final year project exploring how an indie developer can close the 'multiplayer gap', the barrier of server costs and networking complexity that usually keeps solo developers out of multiplayer games. Built in Unity with Mirror and FizzySteamworks for zero-config peer-to-peer connectivity.",
                    highlights: ["Bridged the Steamworks API and Mirror networking library through FizzySteamworks, giving players zero-config peer-to-peer connectivity, no port forwarding or IP address, just a SteamID.",
                                 "Combat uses a hybrid authority model, where the server performs a SphereCastAll to detect hits, whilst the resulting knockback is calculated client-side for smooth, immediate movement.",
                                 "Tile state changes sync via SyncVar hooks, rather than constant transform updates, keeping bandwidth low even with an arena of thousands of platform tiles.",
                                 "Ran several play-tests with real users throughout the course of development, taking in feedback and adjusting variables, adding suggests and fixing bugs found by players."],
                    tags: ["C#", "Unity", "Steamworks", "Mirror"],
                    images: ["assets/partyplaygrounds/thumbnail.png"],
                    website: "https://github.com/swagward/PartyPlaygrounds",
                    video: "https://www.youtube.com/embed/tR7tKOqgvTU"
                }
    }