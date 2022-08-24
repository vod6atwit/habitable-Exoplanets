const { parse } = require('csv-parse'); // read csv file
const fs = require('fs'); // only this module cannot read csv files

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    // koi_insol: Insolation Flux [Earth flux]
    // suggests from Exoplanet Project that an S9eff) value if about 0.36 for a Sun-Like start with coller starts hanving slightly lower values
    // lower limit value koi_insol
    planet['koi_insol'] > 0.36 &&
    // for an Earth-size planet orbiting a Sun-like start, this limit corresponds to an S(eff) of about 1.11
    // upper limit value koi_insol
    planet['koi_insol'] < 1.11 &&
    //koi_prad: Planetary Radius [Earth radii]
    // upper limit value koi_prad
    planet['koi_prad'] < 1.6
  );
}

// chainning event handlers
fs.createReadStream('kepler_data.csv')
  .pipe(
    // readable.pipe(writable)
    parse({
      comment: '#',
      columns: true,
    })
  )
  .on('data', data => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', err => {
    console.log(err);
  })
  .on('end', () => {
    console.log(
      habitablePlanets.map(planet => {
        // match with potentially habitable Exoplanets
        return planet['kepler_name'];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
