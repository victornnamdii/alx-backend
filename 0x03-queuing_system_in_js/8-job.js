const createPushNotificationsJobs = (jobs, queue) => {
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  };

  jobs.forEach((job) => {
    const createdJob = queue.create('push_notification_code_3', job);

    createdJob
    .on('enqueue', () => {
      console.log(`Notification job created: ${createdJob.id}`);
    })
    .on('complete', () => {
      console.log(`Notification job ${createdJob.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Notification job ${createdJob.id} failed: ${err.toString()}`);
    })
    .on('progress', (progress, data) => {
      console.log(`Notification job ${createdJob.id} ${progress}% complete`);
    });
  createdJob.save();
  });
};

export default createPushNotificationsJobs;
