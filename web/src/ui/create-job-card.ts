import type { Job } from '../types/job';

export function createJobCard(job: Job, bikeLabel: string): HTMLElement {
  const article = document.createElement('article');
  article.className = 'card job-card';
  article.dataset.jobId = String(job.id);
  article.setAttribute('data-testid', 'card-job');

  article.innerHTML = `
    <div class="job-top" data-testid="job-top">
      <div>
        <h4 data-testid="text-job-service-type"></h4>
        <p class="muted" data-testid="text-job-meta"></p>
      </div>
      <span class="status" data-testid="status-job"></span>
    </div>

    <p class="job-note" data-testid="text-job-note"></p>

    <div class="job-actions" data-testid="actions-job"></div>
  `;

  const serviceTypeEl = article.querySelector(
    '[data-testid="text-job-service-type"]',
  ) as HTMLElement | null;

  const metaEl = article.querySelector(
    '[data-testid="text-job-meta"]',
  ) as HTMLElement | null;

  const statusEl = article.querySelector(
    '[data-testid="status-job"]',
  ) as HTMLElement | null;

  const noteEl = article.querySelector(
    '[data-testid="text-job-note"]',
  ) as HTMLElement | null;

  const actionsEl = article.querySelector(
    '[data-testid="actions-job"]',
  ) as HTMLElement | null;

  if (!serviceTypeEl || !metaEl || !statusEl || !noteEl || !actionsEl) {
    throw new Error('Job card template missing expected elements');
  }

  serviceTypeEl.textContent = job.service_type;
  metaEl.textContent = `${bikeLabel} • ${job.odometer} km`;
  statusEl.textContent = formatJobStatus(job.status);
  statusEl.classList.add(job.status.replace('_', '-'));
  noteEl.textContent = job.note || 'No note';

  renderJobActions(actionsEl, job.status);

  return article;
}

function formatJobStatus(status: string): string {
  switch (status) {
    case 'requested':
      return 'Requested';
    case 'approved':
      return 'Approved';
    case 'in_progress':
      return 'In Progress';
    case 'done':
      return 'Done';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

function renderJobActions(container: HTMLElement, status: string): void {
  switch (status) {
    case 'requested':
      container.appendChild(
        createActionButton(
          'Approve',
          'approve-job',
          'btn-job-approve',
          'ghost',
        ),
      );
      container.appendChild(
        createActionButton(
          'Cancel',
          'cancel-job',
          'btn-job-cancel',
          'ghost danger',
        ),
      );
      break;

    case 'approved':
      container.appendChild(
        createActionButton('Start', 'start-job', 'btn-job-start', 'ghost'),
      );
      container.appendChild(
        createActionButton(
          'Cancel',
          'cancel-job',
          'btn-job-cancel',
          'ghost danger',
        ),
      );
      break;

    case 'in_progress':
      container.appendChild(
        createActionButton(
          'Mark done',
          'complete-job',
          'btn-job-complete',
          'ghost',
        ),
      );
      break;

    case 'done':
    case 'cancelled':
    default:
      container.remove();
      break;
  }
}

function createActionButton(
  label: string,
  action: string,
  testId: string,
  className: string,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.action = action;
  button.setAttribute('data-testid', testId);
  button.className = className;
  return button;
}
