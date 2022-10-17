import { NextApiRequest, NextApiResponse } from 'next';
import { Match } from '@/lib/types/Match';
import { createMatch } from '@/lib/actions/match2';
import { object, string, array, number, date } from 'yup';
import Database from '@/lib/resources/database';



/**
 * @description = a function that handles api request for creating a match
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		try {

			let { matchHost, sport, matchType, location, matchStart, matchEnd, description, teamA, teamB } = req.body as Match

			

			const schema = object(
				{
					matchHost: string().required(),
					sport: string().required(),
					matchType: string().required(),
					location: object().required(),
					matchStart: date(),
					matchEnd: date(),
					description: string().required(),
					teamA: object().required(),
					teamB: object().required(),
				}
			)

			const validatedMatch = await schema.validate(req.body);	

			const match = {
				matchHost, sport, matchType, location, matchStart, matchEnd, description, teamA, teamB
			}
			await Database.setup()
			const response = await createMatch(match);

			res.status(200).json(
				{
					response
				}
			);

		} catch (error: any) {
			const { code = 500, message } = error;
			res.status(code).json({
				message
			}
			);
			return;
		}
	}
}