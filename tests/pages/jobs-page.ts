import { Page, Locator, expect } from '@playwright/test';

export class JobsPage {
  readonly page: Page;
  readonly pageJobs: Locator;
  readonly pageBikes: Locator;
  readonly jobsNav: Locator;
  readonly jobSelectBike: Locator;
  readonly jobSelectService: Locator;
  readonly jobSelectOdo: Locator;
  readonly jobAddButton: Locator;
  readonly jobAddMessage: Locator;
  readonly jobStatus: Locator;
  readonly filterAllButton: Locator;
  readonly filterRequestedButton: Locator;
  readonly filterApprovedButton: Locator;
  readonly filterInProgressButton: Locator;
  readonly filterDoneButton: Locator;
  readonly filterCancelledButton: Locator;
  readonly jobList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageJobs = page.getByTestId('page-jobs');
    this.pageBikes = page.getByTestId('page-bikes');
    this.jobsNav = page.getByTestId('nav-jobs');
    this.jobSelectBike = page.getByTestId('select-job-bike');
    this.jobSelectService = page.getByTestId('select-job-service-type');
    this.jobSelectOdo = page.getByTestId('input-job-odometer');
    this.jobAddButton = page.getByTestId('btn-create-job');
    this.jobAddMessage = page.getByTestId('message-job-error');
    this.jobStatus = page.getByTestId('status-job');
    this.filterAllButton = page.getByTestId('filter-jobs-all');
    this.filterRequestedButton = page.getByTestId('filter-jobs-requested');
    this.filterApprovedButton = page.getByTestId('filter-jobs-approved');
    this.filterInProgressButton = page.getByTestId('filter-jobs-in-progress');
    this.filterDoneButton = page.getByTestId('filter-jobs-done');
    this.filterCancelledButton = page.getByTestId('filter-jobs-cancelled');
    this.jobList = page.getByTestId('list-jobs');
  }

  async gotoJobsPage(): Promise<void> {
    await this.jobsNav.click();
    await expect(this.pageJobs).toBeVisible();
    await expect(this.pageBikes).toBeHidden();
  }

  async addJob(service: string, bike: string, odo: string): Promise<void> {
    await this.jobSelectBike.selectOption(bike);
    await this.jobSelectService.selectOption(service);
    await this.jobSelectOdo.fill(odo);
    await this.jobAddButton.click();
  }

  async expectJobVisible(name: string): Promise<void> {
    const job = this.page.getByTestId(/card-job/).filter({
      has: this.page
        .getByTestId('text-job-service-type')
        .filter({ hasText: name }),
    });

    await expect(job).toBeVisible();
  }

  async expectJobNotVisible(name: string): Promise<void> {
    const job = this.page.getByTestId(/card-job/).filter({
      has: this.page
        .getByTestId('text-job-service-type')
        .filter({ hasText: name }),
    });

    await expect(job).not.toBeVisible();
  }

  async expectSuccess(message: string): Promise<void> {
    await expect(this.jobAddMessage).toContainText(message);
  }

  async expectError(message: string): Promise<void> {
    await expect(this.jobAddMessage).toContainText(message);
  }

  async findJobByName(service: string) {
    return this.page.getByTestId('card-job').filter({
      has: this.page.getByTestId('text-job-service-type').filter({
        hasText: service,
      }),
    });
  }

  async markJobAs(
    service: string,
    status: 'approved' | 'started' | 'done' | 'cancelled',
  ): Promise<void> {
    const job = await this.findJobByName(service);
    await expect(job).toHaveCount(1);

    switch (status) {
      case 'approved':
        await job.getByTestId('btn-job-approve').click();
        await expect(job.getByTestId('status-job')).toHaveText(/approved/i);
        break;
      case 'started':
        await job.getByTestId('btn-job-start').click();
        await expect(job.getByTestId('status-job')).toHaveText(/in progress/i);
        break;
      case 'done':
        await job.getByTestId('btn-job-complete').click();
        await expect(job.getByTestId('status-job')).toHaveText(/done/i);
        break;
      case 'cancelled':
        await job.getByTestId('btn-job-cancel').click();
        await expect(job.getByTestId('status-job')).toHaveText(/cancelled/i);
        break;
      default:
        break;
    }
  }

  async filterJobs(
    criteria:
      | 'all'
      | 'requested'
      | 'approved'
      | 'inprogress'
      | 'done'
      | 'cancelled',
  ): Promise<void> {
    switch (criteria) {
      case 'all':
        this.filterAllButton.click();
        break;
      case 'requested':
        this.filterRequestedButton.click();
        break;
      case 'approved':
        this.filterApprovedButton.click();
        break;
      case 'inprogress':
        this.filterInProgressButton.click();
        break;
      case 'done':
        this.filterDoneButton.click();
        break;
      case 'cancelled':
        this.filterCancelledButton.click();
        break;
      default:
        break;
    }
  }
}
