import { selectUrlByUserId, selectUserById, sumViewsUrls } from "../repositories/users.repositories.js";

export async function usersData(req, res) {
    const { userId } = res.locals;
    try {
        const { rows: user } =
            await selectUserById(userId);
        const { rows: views } =
            await sumViewsUrls(userId);
        const { rows: shortenedUrls } =
            await selectUrlByUserId(userId);
        
        return res.status(200).send({
            id: userId,
            name: user[0].name,
            visitCount: views[0].sum,
            shortenedUrls
        })
    } catch (error) {
        console.log(error);
        return res.status(500).
            send(error.message);
    }
    

    
}