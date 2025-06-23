export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  
  const session = await getSession({ req })
  if (!session || session.user.role !== "SCOUT") {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const scoutId = session.user.id
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [playersViewed, contactRequests, approvedContacts, activeProspects] = await Promise.all([
      ScoutView.countDocuments({ scoutId }),
      ContactRequest.countDocuments({ scoutId, status: "PENDING" }),
      ContactRequest.countDocuments({ scoutId, status: "APPROVED" }),
      ContactRequest.countDocuments({ 
        scoutId, 
        status: "APPROVED",
        lastContactDate: { $gte: thirtyDaysAgo }
      })
    ])

    res.status(200).json([
      { label: "Players Viewed", value: playersViewed },
      { label: "Contact Requests", value: contactRequests },
      { label: "Approved Contacts", value: approvedContacts },
      { label: "Active Prospects", value: activeProspects }
    ])
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}