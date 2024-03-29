const clubs = [
    {
        "name": "Aikido",
        "email": "aikido@clubhub.ucc.ie",
        "nothing": "aikido@clubhub.ucc.ie",
        "bio": "Aikido club dedicated to the practice and promotion of the Japanese martial art focusing on self-defense techniques and harmonious movement."
    },
    {
        "name": "Archery",
        "email": "archery@clubhub.ucc.ie",
        "nothing": "archery@clubhub.ucc.ie",
        "bio": "Archery club aimed at fostering skills in precision shooting using bows and arrows, blending focus, and athleticism."
    },
    {
        "name": "Athletics",
        "email": "athletics@clubhub.ucc.ie",
        "nothing": "athletics@clubhub.ucc.ie",
        "bio": "Athletics club promoting physical fitness through various track and field events, including running, jumping, and throwing."
    },
    {
        "name": "Aussie Rules Football",
        "email": "aussierulesfootball@clubhub.ucc.ie",
        "nothing": "aussierulesfootball@clubhub.ucc.ie",
        "bio": "Aussie Rules Football club introducing and developing skills in the unique Australian football sport, emphasizing teamwork and strategy."
    },
    {
        "name": "Badminton",
        "email": "badminton@clubhub.ucc.ie",
        "nothing": "badminton@clubhub.ucc.ie",
        "bio": "Badminton club providing opportunities for players of all levels to enjoy and improve their skills in this fast-paced racket sport."
    },
    {
        "name": "Boxing",
        "email": "boxing@clubhub.ucc.ie",
        "nothing": "boxing@clubhub.ucc.ie",
        "bio": "Boxing club focused on teaching the art of boxing, improving physical fitness, and participating in boxing competitions."
    },
    {
        "name": "Camogie (GAA)",
        "email": "camogie@clubhub.ucc.ie",
        "nothing": "camogie@clubhub.ucc.ie",
        "bio": "Camogie club promoting the traditional Irish sport for women, emphasizing skill development and teamwork in Gaelic games."
    },
    {
        "name": "Canoe",
        "email": "canoe@clubhub.ucc.ie",
        "nothing": "canoe@clubhub.ucc.ie",
        "bio": "Canoe club dedicated to exploring waterways, honing paddling techniques, and enjoying the outdoors through canoeing adventures."
    },
    {
        "name": "Chess",
        "email": "chess@clubhub.ucc.ie",
        "nothing": "chess@clubhub.ucc.ie",
        "bio": "Chess club providing opportunities for players to enhance strategic thinking, improve chess skills, and compete in tournaments."
    },
    {
        "name": "Cricket",
        "email": "cricket@clubhub.ucc.ie",
        "nothing": "cricket@clubhub.ucc.ie",
        "bio": "Cricket club fostering a love for the sport, developing batting, bowling, and fielding skills, and competing in local and regional matches."
    },
    {
        "name": "Cycling",
        "email": "cycling@clubhub.ucc.ie",
        "nothing": "cycling@clubhub.ucc.ie",
        "bio": "Cycling club promoting the joy of cycling, organizing group rides, and participating in cycling events and races."
    },
    {
        "name": "Dance",
        "email": "dance@clubhub.ucc.ie",
        "nothing": "dance@clubhub.ucc.ie",
        "bio": "Dance club providing a platform for students to express themselves through various dance styles, from contemporary to hip-hop."
    },
    {
        "name": "Equestrian",
        "email": "equestrian@clubhub.ucc.ie",
        "nothing": "equestrian@clubhub.ucc.ie",
        "bio": "Equestrian club catering to horse enthusiasts, offering riding lessons, organizing equestrian events, and fostering a love for horses."
    },
    {
        "name": "Fencing",
        "email": "fencing@clubhub.ucc.ie",
        "nothing": "fencing@clubhub.ucc.ie",
        "bio": "Fencing club dedicated to teaching and practicing the art of fencing, promoting discipline, agility, and strategic thinking."
    },
    {
        "name": "Football (GAA)",
        "email": "footballgaa@clubhub.ucc.ie",
        "nothing": "footballgaa@clubhub.ucc.ie",
        "bio": "Football club focusing on Gaelic football, emphasizing skill development, teamwork, and participation in GAA competitions."
    },
    {
        "name": "Football - Ladies (GAA)",
        "email": "footballladiesgaa@clubhub.ucc.ie",
        "nothing": "footballladiesgaa@clubhub.ucc.ie",
        "bio": "Ladies' Football club promoting women's participation in Gaelic football, fostering skill development and camaraderie."
    },
    {
        "name": "Futsal",
        "email": "futsal@clubhub.ucc.ie",
        "nothing": "futsal@clubhub.ucc.ie",
        "bio": "Futsal club providing opportunities for players to enjoy the fast-paced indoor soccer game, improving skills and teamwork."
    },
    {
        "name": "Golf",
        "email": "golf@clubhub.ucc.ie",
        "nothing": "golf@clubhub.ucc.ie",
        "bio": "Golf club promoting the sport of golf, organizing tournaments, and providing opportunities for players to improve their game."
    },
    {
        "name": "Handball (GAA)",
        "email": "handballgaa@clubhub.ucc.ie",
        "nothing": "handballgaa@clubhub.ucc.ie",
        "bio": "Handball club dedicated to the traditional Irish sport of handball, offering opportunities for skill development and competition."
    },
    {
        "name": "Hockey - Women's",
        "email": "womenshockey@clubhub.ucc.ie",
        "nothing": "womenshockey@clubhub.ucc.ie",
        "bio": "Women's Hockey club promoting women's participation in field hockey, focusing on skill development and team camaraderie."
    },
    {
        "name": "Hockey - Men's",
        "email": "menshockey@clubhub.ucc.ie",
        "nothing": "menshockey@clubhub.ucc.ie",
        "bio": "Men's Hockey club fostering the love for field hockey among men, focusing on skill enhancement and competitive play."
    },
    {
        "name": "Hurling (GAA)",
        "email": "hurlinggaa@clubhub.ucc.ie",
        "nothing": "hurlinggaa@clubhub.ucc.ie",
        "bio": "Hurling club dedicated to promoting and practicing the ancient Irish sport, emphasizing skill development and team spirit."
    },
    {
        "name": "Inline Hockey",
        "email": "inlinehockey@clubhub.ucc.ie",
        "nothing": "inlinehockey@clubhub.ucc.ie",
        "bio": "Inline Hockey club offering opportunities for players to enjoy roller hockey, improve skills, and compete in inline hockey leagues."
    },
    {
        "name": "Judo",
        "email": "judo@clubhub.ucc.ie",
        "nothing": "judo@clubhub.ucc.ie",
        "bio": "Judo club promoting the martial art of judo, focusing on physical fitness, self-defense techniques, and competition."
    },
    {
        "name": "Karate",
        "email": "karate@clubhub.ucc.ie",
        "nothing": "karate@clubhub.ucc.ie",
        "bio": "Karate club dedicated to teaching the traditional Japanese martial art, focusing on discipline, respect, and self-improvement."
    },
    {
        "name": "Kickboxing",
        "email": "kickboxing@clubhub.ucc.ie",
        "nothing": "kickboxing@clubhub.ucc.ie",
        "bio": "Kickboxing club offering training in kickboxing techniques, promoting physical fitness, and participating in kickboxing competitions."
    },
    {
        "name": "KungFu",
        "email": "kungfu@clubhub.ucc.ie",
        "nothing": "kungfu@clubhub.ucc.ie",
        "bio": "Kung Fu club dedicated to teaching traditional Chinese martial arts, emphasizing discipline, strength, and self-defense."
    },
    {
        "name": "Mountaineering",
        "email": "mountaineering@clubhub.ucc.ie",
        "nothing": "mountaineering@clubhub.ucc.ie",
        "bio": "Mountaineering club promoting outdoor adventures, organizing hikes, climbs, and expeditions to explore mountains and nature."
    },
    {
        "name": "Olympic Handball",
        "email": "olympichandball@clubhub.ucc.ie",
        "nothing": "olympichandball@clubhub.ucc.ie",
        "bio": "Olympic Handball club offering opportunities for players to enjoy and compete in the fast-paced team handball sport."
    },
    {
        "name": "Olympic Weightlifting",
        "email": "olympicweightlifting@clubhub.ucc.ie",
        "nothing": "olympicweightlifting@clubhub.ucc.ie",
        "bio": "Olympic Weightlifting club focused on teaching and practicing the sport of weightlifting, improving strength and technique."
    },
    {
        "name": "Orienteering",
        "email": "orienteering@clubhub.ucc.ie",
        "nothing": "orienteering@clubhub.ucc.ie",
        "bio": "Orienteering club providing opportunities for members to learn navigation skills, participate in orienteering races, and explore the outdoors."
    },
    {
        "name": "Powerlifting",
        "email": "powerlifting@clubhub.ucc.ie",
        "nothing": "powerlifting@clubhub.ucc.ie",
        "bio": "Powerlifting club focused on strength training, teaching powerlifting techniques, and participating in powerlifting competitions."
    },
    {
        "name": "Rovers",
        "email": "rovers@clubhub.ucc.ie",
        "nothing": "rovers@clubhub.ucc.ie",
        "bio": "Rovers club dedicated to outdoor adventure activities, including camping, hiking, and exploring the wilderness."
    },
    {
        "name": "Rowing",
        "email": "rowing@clubhub.ucc.ie",
        "nothing": "rowing@clubhub.ucc.ie",
        "bio": "Rowing club offering opportunities for members to learn rowing techniques, improve fitness, and compete in rowing regattas."
    },
    {
        "name": "Rugby (Men's & Women's)",
        "email": "rugby@clubhub.ucc.ie",
        "nothing": "rugby@clubhub.ucc.ie",
        "bio": "Rugby club catering to both men and women, promoting the sport of rugby, developing skills, and competing in league matches."
    },
    {
        "name": "Sailing",
        "email": "sailing@clubhub.ucc.ie",
        "nothing": "sailing@clubhub.ucc.ie",
        "bio": "Sailing club offering opportunities for members to learn sailing skills, participate in sailing races, and enjoy sailing adventures."
    },
    {
        "name": "Snowsport",
        "email": "snowsport@clubhub.ucc.ie",
        "nothing": "snowsport@clubhub.ucc.ie",
        "bio": "Snowsport club promoting skiing and snowboarding, organizing ski trips, and providing opportunities for members to enjoy winter sports."
    },
    {
        "name": "Soccer (Men's)",
        "email": "soccermens@clubhub.ucc.ie",
        "nothing": "soccermens@clubhub.ucc.ie",
        "bio": "Men's Soccer club fostering a passion for soccer, developing skills, and competing in local and intercollegiate soccer leagues."
    },
    {
        "name": "Soccer (Women's)",
        "email": "soccerwomens@clubhub.ucc.ie",
        "nothing": "soccerwomens@clubhub.ucc.ie",
        "bio": "Women's Soccer club promoting women's participation in soccer, providing skill development opportunities, and competing in leagues."
    },
    {
        "name": "Squash",
        "email": "squash@clubhub.ucc.ie",
        "nothing": "squash@clubhub.ucc.ie",
        "bio": "Squash club offering opportunities for players to enjoy the fast-paced racquet sport, improve skills, and compete in squash tournaments."
    },
    {
        "name": "Sub Aqua",
        "email": "subaqua@clubhub.ucc.ie",
        "nothing": "subaqua@clubhub.ucc.ie",
        "bio": "Sub Aqua club promoting scuba diving, organizing dives, and providing diving training for members to explore underwater worlds."
    },
    {
        "name": "Surf",
        "email": "surf@clubhub.ucc.ie",
        "nothing": "surf@clubhub.ucc.ie",
        "bio": "Surf club dedicated to the sport of surfing, organizing surf trips, providing surf lessons, and fostering a love for the ocean."
    },
    {
        "name": "Swimming & Waterpolo",
        "email": "swimmingwaterpolo@clubhub.ucc.ie",
        "nothing": "swimmingwaterpolo@clubhub.ucc.ie",
        "bio": "Swimming & Water Polo club offering opportunities for members to swim, play water polo, and compete in swimming competitions."
    },
    {
        "name": "Table Tennis",
        "email": "tabletennis@clubhub.ucc.ie",
        "nothing": "tabletennis@clubhub.ucc.ie",
        "bio": "Table Tennis club providing opportunities for players to enjoy the indoor racquet sport, improve skills, and compete in table tennis tournaments."
    },
    {
        "name": "Taekwondo",
        "email": "taekwondo@clubhub.ucc.ie",
        "nothing": "taekwondo@clubhub.ucc.ie",
        "bio": "Taekwondo club focusing on teaching the Korean martial art, promoting physical fitness, discipline, and self-defense."
    },
    {
        "name": "Tennis",
        "email": "tennis@clubhub.ucc.ie",
        "nothing": "tennis@clubhub.ucc.ie",
        "bio": "Tennis club providing opportunities for players to enjoy the sport of tennis, improve skills, and compete in tennis tournaments."
    },
    {
        "name": "Trampoline",
        "email": "trampoline@clubhub.ucc.ie",
        "nothing": "trampoline@clubhub.ucc.ie",
        "bio": "Trampoline club offering opportunities for members to enjoy trampolining, practice skills, and participate in trampoline competitions."
    },
    {
        "name": "Ultimate Frisbee",
        "email": "ultimatefrisbee@clubhub.ucc.ie",
        "nothing": "ultimatefrisbee@clubhub.ucc.ie",
        "bio": "Ultimate Frisbee club promoting the sport of Ultimate Frisbee, emphasizing teamwork, athleticism, and fair play."
    },
    {
        "name": "Volleyball",
        "email": "volleyball@clubhub.ucc.ie",
        "nothing": "volleyball@clubhub.ucc.ie",
        "bio": "Volleyball club providing opportunities for players to enjoy the sport, improve skills, and compete in volleyball tournaments."
    },
    {
        "name": "2022/23 Societies Executive",
        "email": "202223societiesexecutive@clubhub.ucc.ie",
        "nothing": "202223societiesexecutive@clubhub.ucc.ie",
        "bio": "Executive committee overseeing the management and activities of student societies during the academic year 2022/23."
    },
    {
        "name": "2023/24 Executive",
        "email": "202324executive@clubhub.ucc.ie",
        "nothing": "202324executive@clubhub.ucc.ie",
        "bio": "Executive committee responsible for the coordination and administration of student societies for the academic year 2023/24."
    },
    {
        "name": "Accounting and Finance",
        "email": "accountingfinance@clubhub.ucc.ie",
        "nothing": "accountingfinance@clubhub.ucc.ie",
        "bio": "Club focusing on accounting and finance-related activities, including workshops, seminars, and networking opportunities."
    },
    {
        "name": "Alzheimers",
        "email": "alzheimers@clubhub.ucc.ie",
        "nothing": "alzheimers@clubhub.ucc.ie",
        "bio": "Club dedicated to raising awareness about Alzheimer's disease, supporting affected individuals, and fundraising for research."
    },
    {
        "name": "AMSI",
        "email": "amsi@clubhub.ucc.ie",
        "nothing": "amsi@clubhub.ucc.ie",
        "bio": "Association of Medical Students Ireland (AMSI) club providing support, resources, and networking opportunities for medical students."
    },
    {
        "name": "An Chuallacht",
        "email": "anchuallacht@clubhub.ucc.ie",
        "nothing": "anchuallacht@clubhub.ucc.ie",
        "bio": "An Chuallacht club promoting the Irish language and culture through events, language classes, and cultural activities."
    },
    {
        "name": "Ancient Civilisation & Mythology",
        "email": "ancientcivilisationmythology@clubhub.ucc.ie",
        "nothing": "ancientcivilisationmythology@clubhub.ucc.ie",
        "bio": "Club exploring ancient civilizations and mythologies through lectures, discussions, and research projects."
    },
    {
        "name": "Arabic",
        "email": "arabic@clubhub.ucc.ie",
        "nothing": "arabic@clubhub.ucc.ie",
        "bio": "Arabic club promoting the Arabic language and culture through language classes, cultural events, and discussions."
    },
    {
        "name": "Archaeology",
        "email": "archaeology@clubhub.ucc.ie",
        "nothing": "archaeology@clubhub.ucc.ie",
        "bio": "Archaeology club dedicated to the study and preservation of archaeological heritage through fieldwork, lectures, and outreach."
    },
    {
        "name": "Architecture",
        "email": "architecture@clubhub.ucc.ie",
        "nothing": "architecture@clubhub.ucc.ie",
        "bio": "Architecture club fostering creativity and innovation in architecture through design competitions, workshops, and exhibitions."
    },
    {
        "name": "Bangladesh",
        "email": "bangladesh@clubhub.ucc.ie",
        "nothing": "bangladesh@clubhub.ucc.ie",
        "bio": "Club celebrating Bangladeshi culture, traditions, and heritage through cultural events, festivals, and community outreach."
    },
    {
        "name": "BEES (geology old)",
        "email": "beesgeologyold@clubhub.ucc.ie",
        "nothing": "beesgeologyold@clubhub.ucc.ie",
        "bio": "BEES (Biological, Earth & Environmental Sciences) club focusing on geology, environmental science, and related disciplines."
    },
    {
        "name": "Biochemistry",
        "email": "biochemistry@clubhub.ucc.ie",
        "nothing": "biochemistry@clubhub.ucc.ie",
        "bio": "Biochemistry club promoting interest and understanding in biochemistry through seminars, workshops, and laboratory activities."
    },
    {
        "name": "Biology",
        "email": "biology@clubhub.ucc.ie",
        "nothing": "biology@clubhub.ucc.ie",
        "bio": "Biology club fostering a passion for biology through discussions, field trips, and hands-on experiments."
    },
    {
        "name": "Biomedical",
        "email": "biomedical@clubhub.ucc.ie",
        "nothing": "biomedical@clubhub.ucc.ie",
        "bio": "Biomedical club exploring advancements in biomedical sciences through seminars, research projects, and academic collaborations."
    },
    {
        "name": "BIS",
        "email": "bis@clubhub.ucc.ie",
        "nothing": "bis@clubhub.ucc.ie",
        "bio": "Business Information Systems (BIS) club promoting knowledge and skills in information technology, business analytics, and management."
    },
    {
        "name": "Cancer",
        "email": "cancer@clubhub.ucc.ie",
        "nothing": "cancer@clubhub.ucc.ie",
        "bio": "Cancer awareness club raising awareness about cancer prevention, early detection, and supporting individuals affected by cancer."
    },
    {
        "name": "Chemical",
        "email": "chemical@clubhub.ucc.ie",
        "nothing": "chemical@clubhub.ucc.ie",
        "bio": "Chemical sciences club promoting interest and understanding in chemistry through lectures, demonstrations, and laboratory activities."
    },
    {
        "name": "Choral",
        "email": "choral@clubhub.ucc.ie",
        "nothing": "choral@clubhub.ucc.ie",
        "bio": "Choral club bringing together singers to perform choral music, fostering musicality, harmony, and community through singing."
    },
    {
        "name": "Christian Union",
        "email": "christianunion@clubhub.ucc.ie",
        "nothing": "christianunion@clubhub.ucc.ie",
        "bio": "Christian Union club providing a platform for Christian fellowship, spiritual growth, and outreach activities on campus."
    },
    {
        "name": "Clinical Therapy",
        "email": "clinicaltherapy@clubhub.ucc.ie",
        "nothing": "clinicaltherapy@clubhub.ucc.ie",
        "bio": "Clinical Therapy club promoting awareness and understanding of various therapeutic approaches, mental health, and well-being."
    },
    {
        "name": "Clubs & Societies Ball",
        "email": "clubsocietiesball@clubhub.ucc.ie",
        "nothing": "clubsocietiesball@clubhub.ucc.ie",
        "bio": "Organizing committee responsible for planning and hosting the annual Clubs & Societies Ball, celebrating student achievements."
    },
    {
        "name": "Co-Operative",
        "email": "cooperative@clubhub.ucc.ie",
        "nothing": "cooperative@clubhub.ucc.ie",
        "bio": "Cooperative club promoting the principles of cooperation, mutual aid, and community development through cooperative initiatives."
    },
    {
        "name": "Comedy",
        "email": "comedy@clubhub.ucc.ie",
        "nothing": "comedy@clubhub.ucc.ie",
        "bio": "Comedy club providing opportunities for students interested in comedy, including stand-up performances, improvisation, and comedy writing."
    },
    {
        "name": "Commerce",
        "email": "commerce@clubhub.ucc.ie",
        "nothing": "commerce@clubhub.ucc.ie",
        "bio": "Commerce club fostering business knowledge and skills through workshops, seminars, and networking events for commerce students."
    },
    {
        "name": "Connolly Youth",
        "email": "connollyyouth@clubhub.ucc.ie",
        "nothing": "connollyyouth@clubhub.ucc.ie",
        "bio": "Connolly Youth club promoting socialist ideals, social justice, and activism inspired by the legacy of James Connolly."
    },
    {
        "name": "Consulting",
        "email": "consulting@clubhub.ucc.ie",
        "nothing": "consulting@clubhub.ucc.ie",
        "bio": "Consulting club providing resources, workshops, and networking opportunities for students interested in management consulting careers."
    },
    {
        "name": "Criminology",
        "email": "criminology@clubhub.ucc.ie",
        "nothing": "criminology@clubhub.ucc.ie",
        "bio": "Criminology club exploring theories and practices in criminology, criminal justice, and crime prevention through discussions and research."
    },
    {
        "name": "Cumann Drámaíochta",
        "email": "cummanndramaiochta@clubhub.ucc.ie",
        "nothing": "cummanndramaiochta@clubhub.ucc.ie",
        "bio": "Cumann Drámaíochta club promoting Irish language drama and theater, producing and performing plays, and fostering creativity."
    },
    {
        "name": "Dental",
        "email": "dental@clubhub.ucc.ie",
        "nothing": "dental@clubhub.ucc.ie",
        "bio": "Dental club providing support, resources, and networking opportunities for dental students, promoting oral health awareness."
    },
    {
        "name": "Dermatology",
        "email": "dermatology@clubhub.ucc.ie",
        "nothing": "dermatology@clubhub.ucc.ie",
        "bio": "Dermatology club fostering interest and knowledge in dermatological sciences, skin health, and dermatologic care."
    },
    {
        "name": "Disability Activism and Awareness",
        "email": "disabilityactivismawareness@clubhub.ucc.ie",
        "nothing": "disabilityactivismawareness@clubhub.ucc.ie",
        "bio": "Club advocating for disability rights, raising awareness about disability issues, and promoting inclusivity and accessibility on campus."
    },
    {
        "name": "DJ",
        "email": "dj@clubhub.ucc.ie",
        "nothing": "dj@clubhub.ucc.ie",
        "bio": "DJ club providing opportunities for students interested in DJing, mixing music, and organizing DJ performances and events."
    },
    {
        "name": "Doctors Without Borders",
        "email": "doctorswithoutborders@clubhub.ucc.ie",
        "nothing": "doctorswithoutborders@clubhub.ucc.ie",
        "bio": "Doctors Without Borders club raising awareness about global health issues, humanitarian crises, and advocating for healthcare access."
    },
    {
        "name": "Dodgeball",
        "email": "dodgeball@clubhub.ucc.ie",
        "nothing": "dodgeball@clubhub.ucc.ie",
        "bio": "Dodgeball club providing opportunities for students to play and enjoy the fast-paced dodgeball game, promoting fitness and teamwork."
    },
    {
        "name": "Dramatic",
        "email": "dramatic@clubhub.ucc.ie",
        "nothing": "dramatic@clubhub.ucc.ie",
        "bio": "Dramatic club fostering creativity and expression through drama productions, workshops, and theatrical performances."
    },
    {
        "name": "E&S",
        "email": "es@clubhub.ucc.ie",
        "nothing": "es@clubhub.ucc.ie",
        "bio": "Ecology and Environmental Science (E&S) club promoting awareness and action on environmental issues through education and advocacy."
    },
    {
        "name": "Economics",
        "email": "economics@clubhub.ucc.ie",
        "nothing": "economics@clubhub.ucc.ie",
        "bio": "Economics club exploring economic theories, policies, and current events through discussions, seminars, and research."
    },
    {
        "name": "Emergency Care",
        "email": "emergencycare@clubhub.ucc.ie",
        "nothing": "emergencycare@clubhub.ucc.ie",
        "bio": "Emergency Care club providing training, resources, and support for students interested in emergency medicine and first aid."
    },
    {
        "name": "Enactus",
        "email": "enactus@clubhub.ucc.ie",
        "nothing": "enactus@clubhub.ucc.ie",
        "bio": "Enactus club empowering students to make a difference in their communities through entrepreneurial action and social innovation projects."
    },
    {
        "name": "Engineers without Borders",
        "email": "engineerswithoutborders@clubhub.ucc.ie",
        "nothing": "engineerswithoutborders@clubhub.ucc.ie",
        "bio": "Engineers Without Borders club promoting engineering solutions for sustainable development, social justice, and poverty alleviation."
    },
    {
        "name": "English Literature",
        "email": "englishliterature@clubhub.ucc.ie",
        "nothing": "englishliterature@clubhub.ucc.ie",
        "bio": "English Literature club fostering a love for literature through discussions, readings, and literary events."
    },
    {
        "name": "Environmental",
        "email": "environmental@clubhub.ucc.ie",
        "nothing": "environmental@clubhub.ucc.ie",
        "bio": "Environmental club promoting environmental awareness, sustainability practices, and conservation efforts through education and action."
    },
    {
        "name": "Erasmus and International",
        "email": "erasmusandinternational@clubhub.ucc.ie",
        "nothing": "erasmusandinternational@clubhub.ucc.ie",
        "bio": "Erasmus and International club supporting international students, fostering cultural exchange, and organizing events and trips."
    },
    {
        "name": "Europa",
        "email": "europa@clubhub.ucc.ie",
        "nothing": "europa@clubhub.ucc.ie",
        "bio": "Europa club promoting European unity, diversity, and cooperation through cultural events, discussions, and exchange programs."
    },
    {
        "name": "Fashion",
        "email": "fashion@clubhub.ucc.ie",
        "nothing": "fashion@clubhub.ucc.ie",
        "bio": "Fashion club celebrating creativity and expression through fashion shows, design workshops, and discussions on fashion trends."
    },
    {
        "name": "Failte Refugees",
        "email": "failterefugees@clubhub.ucc.ie",
        "nothing": "failterefugees@clubhub.ucc.ie",
        "bio": "Failte Refugees club welcoming refugees, promoting awareness about refugee issues, and providing support and advocacy."
    },
    {
        "name": "Feminist",
        "email": "feminist@clubhub.ucc.ie",
        "nothing": "feminist@clubhub.ucc.ie",
        "bio": "Feminist club advocating for gender equality, women's rights, and challenging sexism and discrimination through education and activism."
    },
    {
        "name": "Fianna Fail",
        "email": "fiannafail@clubhub.ucc.ie",
        "nothing": "fiannafail@clubhub.ucc.ie",
        "bio": "Fianna Fáil club promoting Irish political engagement, discussing policy issues, and supporting the principles of Fianna Fáil party."
    },
    {
        "name": "Film & Photography",
        "email": "filmphotography@clubhub.ucc.ie",
        "nothing": "filmphotography@clubhub.ucc.ie",
        "bio": "Film & Photography club fostering creativity and storytelling through film screenings, photography exhibitions, and workshops."
    },
    {
        "name": "FLAC",
        "email": "flac@clubhub.ucc.ie",
        "nothing": "flac@clubhub.ucc.ie",
        "bio": "Free Legal Advice Centres (FLAC) club providing legal information, advice, and advocacy services to students and the community."
    },
    {
        "name": "Folklore",
        "email": "folklore@clubhub.ucc.ie",
        "nothing": "folklore@clubhub.ucc.ie",
        "bio": "Folklore club exploring myths, legends, and traditions through storytelling, research, and cultural events."
    },
    {
        "name": "Food and Nutrition",
        "email": "foodnutrition@clubhub.ucc.ie",
        "nothing": "foodnutrition@clubhub.ucc.ie",
        "bio": "Food and Nutrition club promoting healthy eating habits, cooking skills, and awareness about nutrition and food sustainability."
    },
    {
        "name": "French",
        "email": "french@clubhub.ucc.ie",
        "nothing": "french@clubhub.ucc.ie",
        "bio": "French club fostering language proficiency and cultural appreciation through language classes, cultural events, and exchange programs."
    },
    {
        "name": "Genetics",
        "email": "genetics@clubhub.ucc.ie",
        "nothing": "genetics@clubhub.ucc.ie",
        "bio": "Genetics club exploring the principles of genetics, genetic research, and biotechnology through discussions and seminars."
    },
    {
        "name": "German",
        "email": "german@clubhub.ucc.ie",
        "nothing": "german@clubhub.ucc.ie",
        "bio": "German club promoting German language proficiency, cultural understanding, and exchange opportunities through language classes and events."
    },
    {
        "name": "Global Justice",
        "email": "globaljustice@clubhub.ucc.ie",
        "nothing": "globaljustice@clubhub.ucc.ie",
        "bio": "Global Justice club advocating for social justice, human rights, and equality through education, activism, and awareness-raising campaigns."
    },
    {
        "name": "GP",
        "email": "gp@clubhub.ucc.ie",
        "nothing": "gp@clubhub.ucc.ie",
        "bio": "General Practice (GP) club providing insights into primary care, healthcare policy, and promoting interest in general practice medicine."
    },
    {
        "name": "Greens",
        "email": "greens@clubhub.ucc.ie",
        "nothing": "greens@clubhub.ucc.ie",
        "bio": "Greens club promoting environmental sustainability, green initiatives, and eco-friendly practices through education and action."
    },
    {
        "name": "Guide Dogs",
        "email": "guidedogs@clubhub.ucc.ie",
        "nothing": "guidedogs@clubhub.ucc.ie",
        "bio": "Guide Dogs club raising awareness about guide dogs, supporting guide dog training, and advocating for the rights of visually impaired individuals."
    },
    {
        "name": "Harry Potter",
        "email": "harrypotter@clubhub.ucc.ie",
        "nothing": "harrypotter@clubhub.ucc.ie",
        "bio": "Harry Potter club bringing together fans of the magical world of Harry Potter, organizing themed events, discussions, and movie marathons."
    },
    {
        "name": "Hispanic",
        "email": "hispanic@clubhub.ucc.ie",
        "nothing": "hispanic@clubhub.ucc.ie",
        "bio": "Hispanic club promoting Spanish language proficiency, Latin American culture, and fostering cultural exchange through events and activities."
    },
    {
        "name": "History",
        "email": "history@clubhub.ucc.ie",
        "nothing": "history@clubhub.ucc.ie",
        "bio": "History club exploring historical events, figures, and themes through lectures, discussions, and historical reenactments."
    },
    {
        "name": "Hope Foundation",
        "email": "hopefoundation@clubhub.ucc.ie",
        "nothing": "hopefoundation@clubhub.ucc.ie",
        "bio": "Hope Foundation club supporting humanitarian efforts, raising funds for charitable causes, and promoting social justice and equality."
    },
    {
        "name": "Horse Racing",
        "email": "horseracing@clubhub.ucc.ie",
        "nothing": "horseracing@clubhub.ucc.ie",
        "bio": "Horse Racing club promoting interest in horse racing, organizing trips to races, and providing insights into the equestrian industry."
    },
    {
        "name": "Indian",
        "email": "indian@clubhub.ucc.ie",
        "nothing": "indian@clubhub.ucc.ie",
        "bio": "Indian club celebrating Indian culture, traditions, and heritage through cultural events, festivals, and community outreach."
    },
    {
        "name": "International Relations",
        "email": "internationalrelations@clubhub.ucc.ie",
        "nothing": "internationalrelations@clubhub.ucc.ie",
        "bio": "International Relations club exploring global politics, diplomacy, and international affairs through discussions, simulations, and conferences."
    },
    {
        "name": "Irish Traditional Music",
        "email": "irishtraditionalmusic@clubhub.ucc.ie",
        "nothing": "irishtraditionalmusic@clubhub.ucc.ie",
        "bio": "Irish Traditional Music club promoting traditional Irish music, sessions, and performances, preserving cultural heritage and fostering musical talent."
    },
    {
        "name": "Islamic",
        "email": "islamic@clubhub.ucc.ie",
        "nothing": "islamic@clubhub.ucc.ie",
        "bio": "Islamic club fostering understanding and appreciation of Islamic culture, faith, and traditions through educational and cultural activities."
    },
    {
        "name": "Italian",
        "email": "italian@clubhub.ucc.ie",
        "nothing": "italian@clubhub.ucc.ie",
        "bio": "Italian club promoting Italian language proficiency, culture, and cuisine through language classes, cultural events, and culinary experiences."
    },
    {
        "name": "Jewish",
        "email": "jewish@clubhub.ucc.ie",
        "nothing": "jewish@clubhub.ucc.ie",
        "bio": "Jewish club fostering Jewish identity, culture, and community on campus through religious events, cultural celebrations, and education."
    },
    {
        "name": "Journalism",
        "email": "journalism@clubhub.ucc.ie",
        "nothing": "journalism@clubhub.ucc.ie",
        "bio": "Journalism club promoting journalistic skills, ethics, and freedom of expression through workshops, discussions, and publishing opportunities."
    },
    {
        "name": "Knitting and Crocheting",
        "email": "knittingcrocheting@clubhub.ucc.ie",
        "nothing": "knittingcrocheting@clubhub.ucc.ie",
        "bio": "Knitting and Crocheting club bringing together enthusiasts to share skills, patterns, and create handmade crafts through workshops and gatherings."
    },
    {
        "name": "Korean",
        "email": "korean@clubhub.ucc.ie",
        "nothing": "korean@clubhub.ucc.ie",
        "bio": "Korean club promoting Korean language proficiency, culture, and traditions through language classes, cultural events, and exchange programs."
    },
    {
        "name": "Labour",
        "email": "labour@clubhub.ucc.ie",
        "nothing": "labour@clubhub.ucc.ie",
        "bio": "Labour club advocating for workers' rights, social justice, and progressive policies through activism, campaigns, and political engagement."
    },
    {
        "name": "Law",
        "email": "law@clubhub.ucc.ie",
        "nothing": "law@clubhub.ucc.ie",
        "bio": "Law club promoting legal knowledge and awareness, facilitating discussions on legal issues, and supporting aspiring law students."
    },
    {
        "name": "LGBTQ",
        "email": "lgbtq@clubhub.ucc.ie",
        "nothing": "lgbtq@clubhub.ucc.ie",
        "bio": "LGBTQ+ club providing support, advocacy, and social activities for LGBTQ+ students, promoting diversity, inclusion, and equality."
    },
    {
        "name": "Macra na Feirme",
        "email": "macranafeirme@clubhub.ucc.ie",
        "nothing": "macranafeirme@clubhub.ucc.ie",
        "bio": "Macra na Feirme club promoting rural youth development, agriculture, and community engagement through social and agricultural events."
    },
    {
        "name": "Mathematical",
        "email": "mathematical@clubhub.ucc.ie",
        "nothing": "mathematical@clubhub.ucc.ie",
        "bio": "Mathematical club promoting interest and proficiency in mathematics through lectures, discussions, and mathematical problem-solving competitions."
    },
    {
        "name": "Medical",
        "email": "medical@clubhub.ucc.ie",
        "nothing": "medical@clubhub.ucc.ie",
        "bio": "Medical club fostering professional development, networking, and support for medical students pursuing careers in healthcare."
    },
    {
        "name": "Medical Research & Technology",
        "email": "medicalresearchtechnology@clubhub.ucc.ie",
        "nothing": "medicalresearchtechnology@clubhub.ucc.ie",
        "bio": "Medical Research & Technology club promoting advancements in medical research, technology, and innovation through seminars and projects."
    },
    {
        "name": "Musical Theatre",
        "email": "musicaltheatre@clubhub.ucc.ie",
        "nothing": "musicaltheatre@clubhub.ucc.ie",
        "bio": "Musical Theatre club bringing together performers, musicians, and enthusiasts to produce and perform musical theater productions."
    },
    {
        "name": "Neurodiversity",
        "email": "neurodiversity@clubhub.ucc.ie",
        "nothing": "neurodiversity@clubhub.ucc.ie",
        "bio": "Neurodiversity club promoting understanding, acceptance, and support for neurodiverse individuals, raising awareness and advocating for inclusivity."
    },
    {
        "name": "Neuroscience & Neurology",
        "email": "neuroscienceneurology@clubhub.ucc.ie",
        "nothing": "neuroscienceneurology@clubhub.ucc.ie",
        "bio": "Neuroscience & Neurology club exploring the brain, nervous system, and related disorders through discussions, research, and outreach."
    },
    {
        "name": "Nursing and Midwifery",
        "email": "nursingmidwifery@clubhub.ucc.ie",
        "nothing": "nursingmidwifery@clubhub.ucc.ie",
        "bio": "Nursing and Midwifery club providing support, resources, and networking opportunities for nursing and midwifery students."
    },
    {
        "name": "Orchestra",
        "email": "orchestra@clubhub.ucc.ie",
        "nothing": "orchestra@clubhub.ucc.ie",
        "bio": "Orchestra club bringing together musicians to perform orchestral music, fostering musical talent and collaboration through rehearsals and performances."
    },
    {
        "name": "Pakistani",
        "email": "pakistani@clubhub.ucc.ie",
        "nothing": "pakistani@clubhub.ucc.ie",
        "bio": "Pakistani club celebrating Pakistani culture, traditions, and heritage through cultural events, festivals, and community outreach."
    },
    {
        "name": "People Before Profit",
        "email": "peoplebeforeprofit@clubhub.ucc.ie",
        "nothing": "peoplebeforeprofit@clubhub.ucc.ie",
        "bio": "People Before Profit club advocating for socialist policies, social justice, and community empowerment through activism and political engagement."
    },
    {
        "name": "Pharmacy",
        "email": "pharmacy@clubhub.ucc.ie",
        "nothing": "pharmacy@clubhub.ucc.ie",
        "bio": "Pharmacy club promoting pharmacy education, professional development, and community outreach activities for pharmacy students."
    },
    {
        "name": "Philosophical",
        "email": "philosophical@clubhub.ucc.ie",
        "nothing": "philosophical@clubhub.ucc.ie",
        "bio": "Philosophical club engaging in philosophical discussions, debates, and exploring fundamental questions about existence, knowledge, and ethics."
    },
    {
        "name": "Planning",
        "email": "planning@clubhub.ucc.ie",
        "nothing": "planning@clubhub.ucc.ie",
        "bio": "Planning club discussing urban planning, sustainability, and community development issues through lectures, workshops, and projects."
    },
    {
        "name": "politics",
        "email": "politics@clubhub.ucc.ie",
        "nothing": "politics@clubhub.ucc.ie",
        "bio": "Politics club fostering political engagement, discussions, and activism on campus, promoting awareness about political issues and participation."
    },
    {
        "name": "Popular Culture Society",
        "email": "popularculturesociety@clubhub.ucc.ie",
        "nothing": "popularculturesociety@clubhub.ucc.ie",
        "bio": "Popular Culture Society club exploring trends, phenomena, and influences in popular culture through events, discussions, and screenings."
    },
    {
        "name": "Psychiatry",
        "email": "psychiatry@clubhub.ucc.ie",
        "nothing": "psychiatry@clubhub.ucc.ie",
        "bio": "Psychiatry club promoting awareness, understanding, and advocacy for mental health and psychiatric issues through education and support."
    },
    {
        "name": "Psychological",
        "email": "psychological@clubhub.ucc.ie",
        "nothing": "psychological@clubhub.ucc.ie",
        "bio": "Psychological club exploring topics in psychology, mental health, and human behavior through discussions, workshops, and research."
    },
    {
        "name": "Public Health",
        "email": "publichealth@clubhub.ucc.ie",
        "nothing": "publichealth@clubhub.ucc.ie",
        "bio": "Public Health club promoting health education, disease prevention, and community health initiatives through outreach and advocacy."
    },
    {
        "name": "SAMH",
        "email": "samh@clubhub.ucc.ie",
        "nothing": "samh@clubhub.ucc.ie",
        "bio": "Student's Association for Mental Health (SAMH) club raising awareness about mental health, providing support, and promoting well-being."
    },
    {
        "name": "Science",
        "email": "science@clubhub.ucc.ie",
        "nothing": "science@clubhub.ucc.ie",
        "bio": "Science club promoting interest and participation in scientific research, experiments, and discussions across various disciplines."
    },
    {
        "name": "Scribble",
        "email": "scribble@clubhub.ucc.ie",
        "nothing": "scribble@clubhub.ucc.ie",
        "bio": "Scribble club providing a platform for creative writing, poetry, and literary expression through workshops, readings, and publications."
    },
    {
        "name": "Simon",
        "email": "simon@clubhub.ucc.ie",
        "nothing": "simon@clubhub.ucc.ie",
        "bio": "Simon club supporting homeless individuals, raising awareness about homelessness issues, and fundraising for homeless charities."
    },
    {
        "name": "Simpsons",
        "email": "simpsons@clubhub.ucc.ie",
        "nothing": "simpsons@clubhub.ucc.ie",
        "bio": "Simpsons club bringing together fans of the animated TV show 'The Simpsons' for discussions, screenings, and themed events."
    },
    {
        "name": "Sinn Fein",
        "email": "sinnfein@clubhub.ucc.ie",
        "nothing": "sinnfein@clubhub.ucc.ie",
        "bio": "Sinn Féin club promoting Irish republican ideals, social justice, and political activism inspired by the Sinn Féin party."
    },
    {
        "name": "Slavic",
        "email": "slavic@clubhub.ucc.ie",
        "nothing": "slavic@clubhub.ucc.ie",
        "bio": "Slavic club celebrating Slavic languages, cultures, and traditions through language classes, cultural events, and community activities."
    },
    {
        "name": "Social Democrats",
        "email": "socialdemocrats@clubhub.ucc.ie",
        "nothing": "socialdemocrats@clubhub.ucc.ie",
        "bio": "Social Democrats club advocating for social democracy, progressive policies, and political engagement, promoting social justice and equality."
    },
    {
        "name": "Socialist",
        "email": "socialist@clubhub.ucc.ie",
        "nothing": "socialist@clubhub.ucc.ie",
        "bio": "Socialist club promoting socialist ideals, economic equality, and social justice through education, activism, and political advocacy."
    },
    {
        "name": "South East Asia",
        "email": "southeastasia@clubhub.ucc.ie",
        "nothing": "southeastasia@clubhub.ucc.ie",
        "bio": "South East Asia club celebrating the cultures, traditions, and diversity of South East Asian countries through events, workshops, and festivals."
    },
    {
        "name": "Students for Sensible Drugs Policy",
        "email": "studentsforsensibledrugspolicy@clubhub.ucc.ie",
        "nothing": "studentsforsensibledrugspolicy@clubhub.ucc.ie",
        "bio": "Students for Sensible Drugs Policy club advocating for evidence-based drug policies, harm reduction, and promoting drug education and awareness."
    },
    {
        "name": "Surgeon Noonan",
        "email": "surgeonnoonan@clubhub.ucc.ie",
        "nothing": "surgeonnoonan@clubhub.ucc.ie",
        "bio": "Surgeon Noonan club providing insights into surgical specialties, career guidance, and fostering interest in surgical medicine."
    },
    {
        "name": "Surgical",
        "email": "surgical@clubhub.ucc.ie",
        "nothing": "surgical@clubhub.ucc.ie",
        "bio": "Surgical club promoting knowledge, skills, and advancements in surgical sciences, fostering professional development for aspiring surgeons."
    },
    {
        "name": "Translational Medicine",
        "email": "translationalmedicine@clubhub.ucc.ie",
        "nothing": "translationalmedicine@clubhub.ucc.ie",
        "bio": "Translational Medicine club bridging the gap between scientific research and medical practice, promoting innovations in healthcare."
    },
    {
        "name": "UCCSU",
        "email": "uccsu@clubhub.ucc.ie",
        "nothing": "uccsu@clubhub.ucc.ie",
        "bio": "University College Cork Students' Union (UCCSU) representing student interests, organizing events, and providing support services."
    },
    {
        "name": "Vegan",
        "email": "vegan@clubhub.ucc.ie",
        "nothing": "vegan@clubhub.ucc.ie",
        "bio": "Vegan club promoting veganism, animal rights, and environmental sustainability through education, activism, and community outreach."
    },
    {
        "name": "WARPS",
        "email": "warps@clubhub.ucc.ie",
        "nothing": "warps@clubhub.ucc.ie",
        "bio": "Worldwide Alternative Realities & Paranormal Society (WARPS) club exploring paranormal phenomena, mysteries, and alternative realities."
    },
    {
        "name": "WISTEM",
        "email": "wistem@clubhub.ucc.ie",
        "nothing": "wistem@clubhub.ucc.ie",
        "bio": "Women in Science, Technology, Engineering, and Mathematics (WiSTEM) club promoting gender equality and diversity in STEM fields."
    },
    {
        "name": "Women in Business and Leadership",
        "email": "womeninbusinessandleadership@clubhub.ucc.ie",
        "nothing": "womeninbusinessandleadership@clubhub.ucc.ie",
        "bio": "Women in Business and Leadership club empowering women in business, entrepreneurship, and leadership through networking and mentorship."
    },
    {
        "name": "Yoga and Meditation",
        "email": "yogaandmeditation@clubhub.ucc.ie",
        "nothing": "yogaandmeditation@clubhub.ucc.ie",
        "bio": "Yoga and Meditation club promoting physical and mental well-being through yoga sessions, meditation practices, and mindfulness activities."
    },
    {
        "name": "Young Fine Gael",
        "email": "youngfinegael@clubhub.ucc.ie",
        "nothing": "youngfinegael@clubhub.ucc.ie",
        "bio": "Young Fine Gael club promoting conservative values, political engagement, and involvement in Irish politics within the Fine Gael party."
    }]