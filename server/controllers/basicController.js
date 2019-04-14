const basicController = {};

basicController.get = (req, res) => {
  res.status(200).json({
    message: 'Welcome to the anagram API!'
  });
};

export default basicController;