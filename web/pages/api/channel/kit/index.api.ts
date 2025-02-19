import type { NextApiRequest, NextApiResponse } from "next"
import mongoose from "mongoose"
import { createHandler } from "@Utils/middlewares/createHandler"
import { Channel } from "@Services/mongodb/models"
import { userAuth } from "@Middlewares/auth"
import { sanitize } from "@Services/mongodb/utils/sanitize"

const handler = createHandler(userAuth)

// Upsert a kit to a channel
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		kitId,
		channelId,
		kitBase,
		previousUpdater,
		customTitle = "",
		options = [],
		blueprint = "",
		featured = false,
		youtubeURL = "",
		tiktokId = "",
		quote = ""
	} = req.body

	const optionsArray = Object.values<IKitOption>(options)
		.filter((opt) => opt._id.length > 0)
		.map((opt) => new mongoose.Types.ObjectId(opt._id))

	if (!kitId) {
		try {
			const data = await Channel.updateOne(
				{ _id: sanitize(channelId) },
				{
					$push: {
						kits: {
							_id: new mongoose.Types.ObjectId(),
							baseId: sanitize(kitBase),
							options: sanitize(optionsArray),
							userData: {
								customTitle: sanitize(customTitle),
								blueprint: sanitize(blueprint),
								featured: sanitize(featured),
								youtubeURL: sanitize(youtubeURL),
								tiktokId: sanitize(tiktokId),
								quote: sanitize(quote)
							}
						}
					},
					previousUpdater
				}
			)

			return res.status(200).json({ success: true, data })
		} catch (error) {
			return res.status(400).json({ success: false, error })
		}
	}

	if (kitId) {
		try {
			const data = await Channel.findOneAndUpdate(
				{
					_id: sanitize(channelId),
					kits: {
						$elemMatch: {
							_id: new mongoose.Types.ObjectId(sanitize(kitId))
						}
					}
				},
				{
					$set: {
						"kits.$[kit]": {
							_id: new mongoose.Types.ObjectId(sanitize(kitId)),
							baseId: sanitize(kitBase),
							options: sanitize(optionsArray),
							userData: {
								customTitle: sanitize(customTitle),
								blueprint: sanitize(blueprint),
								featured: sanitize(featured),
								youtubeURL: sanitize(youtubeURL),
								tiktokId: sanitize(tiktokId),
								quote: sanitize(quote)
							}
						}
					},
					previousUpdater
				},
				{
					arrayFilters: [{ "kit._id": new mongoose.Types.ObjectId(sanitize(kitId)) }],
					new: true
				}
			)

			return res.status(200).json({ success: true, data })
		} catch (error) {
			return res.status(400).json({ success: false, error })
		}
	}
})

// Delete a channel's kit
handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
	const { channelId, kitId } = req.body

	try {
		const data = await Channel.findOneAndUpdate(
			{ _id: channelId },
			{ $pull: { kits: { _id: new mongoose.Types.ObjectId(sanitize(kitId)) } } },
			{ new: true }
		)

		return res.status(200).json({ success: true, data })
	} catch (error) {
		return res.status(400).json({ success: false, error })
	}
})

export default handler
