export const fetchDepartmentsData = (setDepartment, setDepartmentsList) => {
  fetch("/departments_list.geojson")
    .then((res) => res.json())
    .then((data) => setDepartmentsList(data.features));

  fetch("https://departemental-backend.vercel.app/api/department-of-the-day/classic")
    .then((res) => res.json())
    .then((data) => setDepartment(data));
};
