export const fetchDepartmentsData = (setDepartment, setDepartmentsList) => {
  fetch("/departments_list.geojson")
    .then((res) => res.json())
    .then((data) => setDepartmentsList(data.features));

  fetch("http://localhost:3001/api/department-of-the-day")
    .then((res) => res.json())
    .then((data) => setDepartment(data));
};
