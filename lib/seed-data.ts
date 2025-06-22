import { getDatabase, COLLECTIONS } from "./mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

// Kenyan Counties Data
export const KENYAN_COUNTIES = [
  { name: "Baringo", region: "Rift Valley", population: 666763 },
  { name: "Bomet", region: "Rift Valley", population: 875689 },
  { name: "Bungoma", region: "Western", population: 1670570 },
  { name: "Busia", region: "Western", population: 893681 },
  { name: "Elgeyo-Marakwet", region: "Rift Valley", population: 454480 },
  { name: "Embu", region: "Eastern", population: 608599 },
  { name: "Garissa", region: "North Eastern", population: 841353 },
  { name: "Homa Bay", region: "Nyanza", population: 1131950 },
  { name: "Isiolo", region: "Eastern", population: 268002 },
  { name: "Kajiado", region: "Rift Valley", population: 1117840 },
  { name: "Kakamega", region: "Western", population: 1867579 },
  { name: "Kericho", region: "Rift Valley", population: 901777 },
  { name: "Kiambu", region: "Central", population: 2417735 },
  { name: "Kilifi", region: "Coast", population: 1453787 },
  { name: "Kirinyaga", region: "Central", population: 610411 },
  { name: "Kisii", region: "Nyanza", population: 1266860 },
  { name: "Kisumu", region: "Nyanza", population: 1155574 },
  { name: "Kitui", region: "Eastern", population: 1136187 },
  { name: "Kwale", region: "Coast", population: 866820 },
  { name: "Laikipia", region: "Central", population: 518560 },
  { name: "Lamu", region: "Coast", population: 143920 },
  { name: "Machakos", region: "Eastern", population: 1421932 },
  { name: "Makueni", region: "Eastern", population: 987653 },
  { name: "Mandera", region: "North Eastern", population: 1025756 },
  { name: "Marsabit", region: "Northern", population: 459785 },
  { name: "Meru", region: "Eastern", population: 1545714 },
  { name: "Migori", region: "Nyanza", population: 1116436 },
  { name: "Mombasa", region: "Coast", population: 1208333 },
  { name: "Murang'a", region: "Central", population: 1056640 },
  { name: "Nairobi", region: "Nairobi", population: 4397073 },
  { name: "Nakuru", region: "Rift Valley", population: 2162202 },
  { name: "Nandi", region: "Rift Valley", population: 885711 },
  { name: "Narok", region: "Rift Valley", population: 1157873 },
  { name: "Nyamira", region: "Nyanza", population: 605576 },
  { name: "Nyandarua", region: "Central", population: 638289 },
  { name: "Nyeri", region: "Central", population: 759164 },
  { name: "Samburu", region: "Rift Valley", population: 310327 },
  { name: "Siaya", region: "Nyanza", population: 993183 },
  { name: "Taita-Taveta", region: "Coast", population: 340671 },
  { name: "Tana River", region: "Coast", population: 315943 },
  { name: "Tharaka-Nithi", region: "Eastern", population: 393177 },
  { name: "Trans Nzoia", region: "Rift Valley", population: 990341 },
  { name: "Turkana", region: "Northern", population: 926976 },
  { name: "Uasin Gishu", region: "Rift Valley", population: 1163186 },
  { name: "Vihiga", region: "Western", population: 590013 },
  { name: "Wajir", region: "North Eastern", population: 781263 },
  { name: "West Pokot", region: "Rift Valley", population: 621241 },
]

// Sports Data with Kenyan context
export const KENYAN_SPORTS = [
  {
    name: "Football",
    category: "Team Sport",
    popularity: "Very High",
    positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker", "Winger"],
    governing_body: "Football Kenya Federation (FKF)",
    major_clubs: ["AFC Leopards", "Gor Mahia", "Tusker FC", "KCB FC", "Bandari FC"],
  },
  {
    name: "Rugby",
    category: "Team Sport",
    popularity: "High",
    positions: [
      "Prop",
      "Hooker",
      "Lock",
      "Flanker",
      "Number 8",
      "Scrum Half",
      "Fly Half",
      "Centre",
      "Wing",
      "Fullback",
    ],
    governing_body: "Kenya Rugby Union",
    major_clubs: ["Kenya Harlequin", "Impala Saracens", "KCB RFC", "Strathmore Leos"],
  },
  {
    name: "Basketball",
    category: "Team Sport",
    popularity: "Medium",
    positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
    governing_body: "Kenya Basketball Federation",
    major_clubs: ["Equity Bank", "KPA", "Ulinzi Warriors", "Thunder"],
  },
  {
    name: "Athletics",
    category: "Individual Sport",
    popularity: "Very High",
    events: [
      "100m",
      "200m",
      "400m",
      "800m",
      "1500m",
      "5000m",
      "10000m",
      "Marathon",
      "Steeplechase",
      "Hurdles",
      "Long Jump",
      "High Jump",
      "Shot Put",
      "Javelin",
    ],
    governing_body: "Athletics Kenya",
    specialties: ["Long Distance Running", "Steeplechase", "Marathon"],
  },
  {
    name: "Volleyball",
    category: "Team Sport",
    popularity: "Medium",
    positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero"],
    governing_body: "Kenya Volleyball Federation",
    major_clubs: ["Kenya Prisons", "KCB", "GSU", "Kenya Pipeline"],
  },
  {
    name: "Netball",
    category: "Team Sport",
    popularity: "High",
    positions: ["Goal Shooter", "Goal Attack", "Wing Attack", "Centre", "Wing Defence", "Goal Defence", "Goal Keeper"],
    governing_body: "Kenya Netball Federation",
    major_clubs: ["Kenya Prisons", "Equity Bank", "KCB", "Ulinzi Sharks"],
  },
  {
    name: "Boxing",
    category: "Individual Sport",
    popularity: "Medium",
    weight_classes: [
      "Light Flyweight",
      "Flyweight",
      "Bantamweight",
      "Featherweight",
      "Lightweight",
      "Welterweight",
      "Middleweight",
      "Heavyweight",
    ],
    governing_body: "Boxing Association of Kenya",
  },
  {
    name: "Swimming",
    category: "Individual Sport",
    popularity: "Low",
    events: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"],
    governing_body: "Kenya Swimming Federation",
  },
  {
    name: "Cricket",
    category: "Team Sport",
    popularity: "Low",
    positions: ["Batsman", "Bowler", "All-rounder", "Wicket Keeper"],
    governing_body: "Cricket Kenya",
  },
  {
    name: "Hockey",
    category: "Team Sport",
    popularity: "Low",
    positions: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
    governing_body: "Kenya Hockey Union",
  },
  {
    name: "Tennis",
    category: "Individual Sport",
    popularity: "Low",
    categories: ["Singles", "Doubles"],
    governing_body: "Kenya Lawn Tennis Association",
  },
  {
    name: "Badminton",
    category: "Individual Sport",
    popularity: "Low",
    categories: ["Singles", "Doubles", "Mixed Doubles"],
    governing_body: "Kenya Badminton Association",
  },
]

// Sample opportunities data
export const SAMPLE_OPPORTUNITIES = [
  {
    title: "Nairobi County Youth Football League Tryouts",
    description:
      "Open tryouts for talented young footballers to join the Nairobi County Youth League. Scouts from major clubs will be present.",
    organizationName: "Nairobi County Football Association",
    organizationContact: {
      email: "info@nairobifootball.ke",
      phone: "+254700123456",
      website: "www.nairobifootball.ke",
    },
    sport: "Football",
    opportunityType: "tryout",
    ageRangeMin: 16,
    ageRangeMax: 21,
    location: "Nyayo National Stadium",
    county: "Nairobi",
    requirements: [
      "Valid ID or Birth Certificate",
      "Medical Certificate",
      "Passport Photos",
      "Registration Fee: KSh 500",
    ],
    applicationDeadline: new Date("2024-12-31"),
    eventDate: new Date("2025-01-15"),
    maxParticipants: 200,
    currentParticipants: 0,
    isActive: true,
  },
  {
    title: "Kenya Rugby Academy Scholarship Program",
    description:
      "Full scholarship program for promising rugby players including training, accommodation, and education support.",
    organizationName: "Kenya Rugby Union",
    organizationContact: {
      email: "academy@kru.co.ke",
      phone: "+254722334455",
      website: "www.kru.co.ke",
    },
    sport: "Rugby",
    opportunityType: "scholarship",
    ageRangeMin: 16,
    ageRangeMax: 19,
    location: "RFUEA Ground",
    county: "Nairobi",
    requirements: [
      "KCSE Certificate",
      "Rugby Experience",
      "Physical Fitness Test",
      "Academic Performance (C+ and above)",
    ],
    applicationDeadline: new Date("2024-11-30"),
    eventDate: new Date("2025-02-01"),
    maxParticipants: 30,
    currentParticipants: 0,
    isActive: true,
  },
  {
    title: "Mombasa Basketball Development Camp",
    description:
      "Intensive basketball training camp focusing on skill development and talent identification for coastal region players.",
    organizationName: "Coast Basketball Association",
    organizationContact: {
      email: "info@coastbasketball.ke",
      phone: "+254733445566",
    },
    sport: "Basketball",
    opportunityType: "camp",
    ageRangeMin: 14,
    ageRangeMax: 18,
    location: "Mombasa Sports Club",
    county: "Mombasa",
    requirements: ["Basketball Experience", "Medical Certificate", "Camp Fee: KSh 2000"],
    applicationDeadline: new Date("2024-12-15"),
    eventDate: new Date("2024-12-20"),
    maxParticipants: 50,
    currentParticipants: 0,
    isActive: true,
  },
  {
    title: "Athletics Kenya Talent Search - Rift Valley",
    description:
      "Regional talent identification program for middle and long-distance runners in the Rift Valley region.",
    organizationName: "Athletics Kenya",
    organizationContact: {
      email: "talent@athleticskenya.or.ke",
      phone: "+254711223344",
      website: "www.athleticskenya.or.ke",
    },
    sport: "Athletics",
    opportunityType: "tryout",
    ageRangeMin: 16,
    ageRangeMax: 23,
    location: "Eldoret Sports Club",
    county: "Uasin Gishu",
    requirements: ["Running Experience", "Medical Certificate", "Valid ID"],
    applicationDeadline: new Date("2025-01-10"),
    eventDate: new Date("2025-01-20"),
    maxParticipants: 100,
    currentParticipants: 0,
    isActive: true,
  },
  {
    title: "Kenya Netball Federation Academy",
    description:
      "Elite netball academy program for talented female players with professional coaching and development opportunities.",
    organizationName: "Kenya Netball Federation",
    organizationContact: {
      email: "academy@netballkenya.com",
      phone: "+254755667788",
    },
    sport: "Netball",
    opportunityType: "academy",
    ageRangeMin: 15,
    ageRangeMax: 20,
    location: "Kasarani Sports Complex",
    county: "Nairobi",
    requirements: ["Netball Experience", "Height minimum 5'6\"", "Academic Performance", "Medical Certificate"],
    applicationDeadline: new Date("2025-02-28"),
    eventDate: new Date("2025-03-15"),
    maxParticipants: 25,
    currentParticipants: 0,
    isActive: true,
  },
]

// Sample players data
export const SAMPLE_PLAYERS = [
  {
    email: "john.kamau@email.com",
    firstName: "John",
    lastName: "Kamau",
    phone: "+254701234567",
    county: "Nairobi",
    dateOfBirth: new Date("2007-03-15"),
    sport: "Football",
    position: "Midfielder",
    bio: "Passionate midfielder with excellent ball control and vision. Started playing at age 8 in local youth leagues. Dreams of representing Kenya at international level.",
    aiScore: 87.5,
    height: 175,
    weight: 68,
    stats: {
      matches: 24,
      goals: 8,
      assists: 15,
      points: 0,
      personalBest: "",
      medals: 2,
    },
  },
  {
    email: "mary.wanjiku@email.com",
    firstName: "Mary",
    lastName: "Wanjiku",
    phone: "+254702345678",
    county: "Kiambu",
    dateOfBirth: new Date("2008-07-22"),
    sport: "Basketball",
    position: "Point Guard",
    bio: "Dynamic point guard with exceptional court vision and leadership skills. Captain of school team for 2 years.",
    aiScore: 92.8,
    height: 168,
    weight: 58,
    stats: {
      matches: 18,
      goals: 0,
      assists: 89,
      points: 156,
      personalBest: "",
      medals: 3,
    },
  },
  {
    email: "david.ochieng@email.com",
    firstName: "David",
    lastName: "Ochieng",
    phone: "+254703456789",
    county: "Kisumu",
    dateOfBirth: new Date("2006-11-08"),
    sport: "Rugby",
    position: "Fly Half",
    bio: "Tactical fly half with strong kicking game and game management skills. Represented Western Kenya in national championships.",
    aiScore: 91.2,
    height: 178,
    weight: 75,
    stats: {
      matches: 16,
      goals: 0,
      assists: 0,
      points: 124,
      personalBest: "",
      medals: 1,
    },
  },
  {
    email: "grace.muthoni@email.com",
    firstName: "Grace",
    lastName: "Muthoni",
    phone: "+254704567890",
    county: "Nyeri",
    dateOfBirth: new Date("2007-05-12"),
    sport: "Athletics",
    position: "400m Runner",
    bio: "Promising 400m runner with consistent improvement in times. Trains at high altitude in Nyeri for endurance advantage.",
    aiScore: 89.7,
    height: 165,
    weight: 52,
    stats: {
      matches: 12,
      goals: 0,
      assists: 0,
      points: 0,
      personalBest: "52.34s",
      medals: 4,
    },
  },
  {
    email: "peter.kipchoge@email.com",
    firstName: "Peter",
    lastName: "Kipchoge",
    phone: "+254705678901",
    county: "Nandi",
    dateOfBirth: new Date("2005-09-03"),
    sport: "Athletics",
    position: "Marathon",
    bio: "Long-distance runner from the famous running county of Nandi. Follows in the footsteps of Kenyan marathon legends.",
    aiScore: 88.9,
    height: 172,
    weight: 58,
    stats: {
      matches: 8,
      goals: 0,
      assists: 0,
      points: 0,
      personalBest: "2:15:23",
      medals: 2,
    },
  },
  {
    email: "faith.akinyi@email.com",
    firstName: "Faith",
    lastName: "Akinyi",
    phone: "+254706789012",
    county: "Homa Bay",
    dateOfBirth: new Date("2008-01-20"),
    sport: "Netball",
    position: "Goal Shooter",
    bio: "Tall and accurate goal shooter with excellent shooting percentage. Led county team to regional championships.",
    aiScore: 85.3,
    height: 180,
    weight: 65,
    stats: {
      matches: 20,
      goals: 156,
      assists: 23,
      points: 0,
      personalBest: "",
      medals: 3,
    },
  },
  {
    email: "samuel.kiptoo@email.com",
    firstName: "Samuel",
    lastName: "Kiptoo",
    phone: "+254707890123",
    county: "Kericho",
    dateOfBirth: new Date("2006-12-05"),
    sport: "Athletics",
    position: "Steeplechase",
    bio: "Steeplechase specialist from the tea-growing highlands of Kericho. Natural barrier technique and strong finishing kick.",
    aiScore: 90.1,
    height: 170,
    weight: 60,
    stats: {
      matches: 10,
      goals: 0,
      assists: 0,
      points: 0,
      personalBest: "8:45.67",
      medals: 5,
    },
  },
  {
    email: "esther.wanjiru@email.com",
    firstName: "Esther",
    lastName: "Wanjiru",
    phone: "+254708901234",
    county: "Murang'a",
    dateOfBirth: new Date("2007-08-14"),
    sport: "Volleyball",
    position: "Outside Hitter",
    bio: "Powerful outside hitter with strong attacking skills. Key player in school's volleyball dominance in Central Kenya.",
    aiScore: 86.7,
    height: 175,
    weight: 62,
    stats: {
      matches: 22,
      goals: 0,
      assists: 45,
      points: 234,
      personalBest: "",
      medals: 2,
    },
  },
]

// Sample scouts data
export const SAMPLE_SCOUTS = [
  {
    email: "james.mwangi@scout.com",
    firstName: "James",
    lastName: "Mwangi",
    phone: "+254710123456",
    county: "Nairobi",
    dateOfBirth: new Date("1985-04-20"),
    clubName: "AFC Leopards",
    licenseNumber: "KFF-2024-001",
    organizationType: "professional_club",
    specialization: "Youth Development",
  },
  {
    email: "mary.njeri@scout.com",
    firstName: "Mary",
    lastName: "Njeri",
    phone: "+254711234567",
    county: "Mombasa",
    dateOfBirth: new Date("1982-08-15"),
    clubName: "Kenya Basketball Federation",
    licenseNumber: "KBF-2024-002",
    organizationType: "federation",
    specialization: "Women's Basketball",
  },
  {
    email: "peter.ouma@scout.com",
    firstName: "Peter",
    lastName: "Ouma",
    phone: "+254712345678",
    county: "Kisumu",
    dateOfBirth: new Date("1988-12-10"),
    clubName: "Kenya Rugby Union",
    licenseNumber: "KRU-2024-003",
    organizationType: "union",
    specialization: "Rugby Sevens",
  },
  {
    email: "susan.chebet@scout.com",
    firstName: "Susan",
    lastName: "Chebet",
    phone: "+254713456789",
    county: "Eldoret",
    dateOfBirth: new Date("1990-06-25"),
    clubName: "Athletics Kenya",
    licenseNumber: "AK-2024-004",
    organizationType: "federation",
    specialization: "Long Distance Running",
  },
]

// Sample parents data
export const SAMPLE_PARENTS = [
  {
    email: "parent.kamau@email.com",
    firstName: "Samuel",
    lastName: "Kamau",
    phone: "+254720123456",
    county: "Nairobi",
    dateOfBirth: new Date("1975-06-25"),
  },
  {
    email: "parent.wanjiku@email.com",
    firstName: "Jane",
    lastName: "Wanjiku",
    phone: "+254721234567",
    county: "Kiambu",
    dateOfBirth: new Date("1978-03-18"),
  },
]

export async function seedDatabase() {
  try {
    const db = await getDatabase()
    console.log("🌱 Starting database seeding...")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await db.collection(COLLECTIONS.COUNTIES).deleteMany({})
    await db.collection(COLLECTIONS.SPORTS).deleteMany({})
    await db.collection(COLLECTIONS.OPPORTUNITIES).deleteMany({})
    await db.collection(COLLECTIONS.USERS).deleteMany({})
    await db.collection(COLLECTIONS.PLAYERS).deleteMany({})
    await db.collection(COLLECTIONS.SCOUTS).deleteMany({})
    await db.collection(COLLECTIONS.PARENTS).deleteMany({})

    // Seed counties
    console.log("🏞️ Seeding counties...")
    await db.collection(COLLECTIONS.COUNTIES).insertMany(
      KENYAN_COUNTIES.map((county) => ({
        ...county,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    // Seed sports
    console.log("⚽ Seeding sports...")
    await db.collection(COLLECTIONS.SPORTS).insertMany(
      KENYAN_SPORTS.map((sport) => ({
        ...sport,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    // Seed opportunities
    console.log("🎯 Seeding opportunities...")
    const opportunityDocs = SAMPLE_OPPORTUNITIES.map((opportunity) => ({
      ...opportunity,
      createdBy: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    await db.collection(COLLECTIONS.OPPORTUNITIES).insertMany(opportunityDocs)

    // Seed users (players, scouts, parents)
    console.log("👥 Seeding users...")

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("password", 12)

    // Create players
    for (const playerData of SAMPLE_PLAYERS) {
      const playerId = new ObjectId()
      const player = {
        _id: playerId,
        ...playerData,
        passwordHash: hashedPassword,
        role: "player" as const,
        privacySettings: {
          profileVisible: true,
          allowScoutContact: true,
          showPersonalInfo: false,
          allowVideoAnalysis: true,
        },
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection(COLLECTIONS.USERS).insertOne(player)
      await db.collection(COLLECTIONS.PLAYERS).insertOne(player)
    }

    // Create scouts
    for (const scoutData of SAMPLE_SCOUTS) {
      const scoutId = new ObjectId()
      const scout = {
        _id: scoutId,
        ...scoutData,
        passwordHash: hashedPassword,
        role: "scout" as const,
        isVerified: true,
        verificationDocuments: [],
        verificationStatus: "approved" as const,
        verifiedAt: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection(COLLECTIONS.USERS).insertOne(scout)
      await db.collection(COLLECTIONS.SCOUTS).insertOne(scout)
    }

    // Create parents
    for (const parentData of SAMPLE_PARENTS) {
      const parentId = new ObjectId()
      const parent = {
        _id: parentId,
        ...parentData,
        passwordHash: hashedPassword,
        role: "parent" as const,
        childrenIds: [],
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
        },
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection(COLLECTIONS.USERS).insertOne(parent)
      await db.collection(COLLECTIONS.PARENTS).insertOne(parent)
    }

    console.log("✅ Database seeding completed successfully!")
    console.log(`📊 Seeded:`)
    console.log(`   - ${KENYAN_COUNTIES.length} counties`)
    console.log(`   - ${KENYAN_SPORTS.length} sports`)
    console.log(`   - ${SAMPLE_OPPORTUNITIES.length} opportunities`)
    console.log(`   - ${SAMPLE_PLAYERS.length} players`)
    console.log(`   - ${SAMPLE_SCOUTS.length} scouts`)
    console.log(`   - ${SAMPLE_PARENTS.length} parents`)

    return true
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    throw error
  }
}
