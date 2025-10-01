exports.canCreateStudent = (req, res, next) => {
    const loggedUserId = req.user.id;
    const loggedUserPosition = req.user.position;

    const assignedPreceptorId = req.body.preceptor_id;

    if(loggedUserPosition === 'Coordenacao') {
        return next();
    }

    if(loggedUserPosition === 'Preceptor') {
        if (assignedPreceptorId === loggedUserId) {
            return next();
        }
    } else {
        return res.status(403).json({ message: 'Preceptores só podem cadastrar alunos sob sua própria responsabilidade' })
    }

    return res.status(403).json({ message: 'Você não tem permissão para realizar esta ação.' })
}