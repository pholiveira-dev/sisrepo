exports.canCreateStudent = (req, res, next) => {
    const loggedUserPosition = req.user.position;

    if(loggedUserPosition === 'Coordenacao' || loggedUserPosition == 'Preceptor') {
        return next();
    }

    return res.status(403).json({ message: 'Apenas pessoas da Coordenação e Preceptores tem autorização para cadastrar alunos' })
}