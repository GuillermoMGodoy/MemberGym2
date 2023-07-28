function addMember(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const currentDate = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(currentDate.getDate() + 30);

  const member = {
    name: name,
    expirationDate: expirationDate.toISOString(),
  };

  let membersList = JSON.parse(localStorage.getItem('members')) || [];
  membersList.push(member);

  localStorage.setItem('members', JSON.stringify(membersList));

  updateMembershipList();
  document.getElementById('name').value = '';
}

function updateMembershipList() {
  const membersList = JSON.parse(localStorage.getItem('members')) || [];

  const membersContainer = document.getElementById('members-list');
  membersContainer.innerHTML = '';

  const currentDate = new Date();

  for (const member of membersList) {
    const expirationDate = new Date(member.expirationDate);

    const memberItem = document.createElement('div');
    memberItem.classList.add('member');

    if (currentDate > expirationDate) {
      memberItem.classList.add('expired');
    } else {
      memberItem.classList.add('active');
    }

    memberItem.innerHTML = `
      <span>${member.name}</span>
      <span>${expirationDate.toLocaleDateString()}</span>
      <span class="delete-button" onclick="removeMember(this)">Eliminar</span>
    `;

    membersContainer.appendChild(memberItem);
  }
}

function removeMember(button) {
  const memberItem = button.parentElement;
  const memberName = memberItem.querySelector('span:first-child').textContent;

  let membersList = JSON.parse(localStorage.getItem('members')) || [];
  membersList = membersList.filter((member) => member.name !== memberName);
  localStorage.setItem('members', JSON.stringify(membersList));

  memberItem.remove();
}

document.addEventListener('DOMContentLoaded', updateMembershipList);

document.getElementById('membership-form').addEventListener('submit', function (event) {
  addMember(event);
});

updateMembershipList(); // Actualiza la lista de miembros al cargar la página inicialmente

