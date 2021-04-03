import axios from 'axios';

export async function getDataMentors() {
  const name = await axios
    .get('https://techstars-api.herokuapp.com/api/results/mentors')
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error(e);
    });
  return name;
}
export async function getDataCompanies() {
  const name = await axios
    .get('https://techstars-api.herokuapp.com/api/results/companies')
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error(e);
    });
  return name;
}
export async function getMentorName(id) {
  const name = await axios
    .get(`https://techstars-api.herokuapp.com/api/mentors/${id}`)
    .then((res) => {
      return res.data.mentor;
    })
    .catch((e) => {
      console.error(e);
    });
  return name;
}
export async function getCompanyName(id) {
  const name = await axios
    .get(`https://techstars-api.herokuapp.com/api/companies/${id}`)
    .then((res) => {
      return res.data.company;
    })
    .catch((e) => {
      console.error(e);
    });
  return name;
}
export async function mentorOrCompany(id) {
  const flag = await axios
    .get(`https://techstars-api.herokuapp.com/api/mentors/${id}`)
    .then((res) => {
      if (res.data !== null) {
        return 1;
      }
      return 2;
    });
  return flag;
}
