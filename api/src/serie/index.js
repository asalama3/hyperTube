import { Serie } from '../Schema';

export const serie = (req, res) => {
  const data = req.params.id;
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      res.send(results);
    });
};
