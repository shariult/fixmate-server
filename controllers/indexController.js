function getHome(req, res) {
  res.json(
    "Welcome to FixMate API! Send request to proper route to get response.",
  );
}

export default { getHome };
