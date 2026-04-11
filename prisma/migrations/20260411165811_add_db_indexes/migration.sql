-- CreateIndex
CREATE INDEX "application_forms_schoolId_idx" ON "application_forms"("schoolId");

-- CreateIndex
CREATE INDEX "application_forms_createdAt_idx" ON "application_forms"("createdAt");

-- CreateIndex
CREATE INDEX "contact_forms_schoolId_idx" ON "contact_forms"("schoolId");

-- CreateIndex
CREATE INDEX "contact_forms_createdAt_idx" ON "contact_forms"("createdAt");

-- CreateIndex
CREATE INDEX "events_schoolId_idx" ON "events"("schoolId");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "events"("createdAt");

-- CreateIndex
CREATE INDEX "gallery_images_schoolId_idx" ON "gallery_images"("schoolId");

-- CreateIndex
CREATE INDEX "gallery_images_createdAt_idx" ON "gallery_images"("createdAt");

-- CreateIndex
CREATE INDEX "notices_schoolId_idx" ON "notices"("schoolId");

-- CreateIndex
CREATE INDEX "notices_createdAt_idx" ON "notices"("createdAt");

-- CreateIndex
CREATE INDEX "notification_messages_schoolId_idx" ON "notification_messages"("schoolId");

-- CreateIndex
CREATE INDEX "notification_messages_createdAt_idx" ON "notification_messages"("createdAt");

-- CreateIndex
CREATE INDEX "parents_schoolId_idx" ON "parents"("schoolId");

-- CreateIndex
CREATE INDEX "parents_createdAt_idx" ON "parents"("createdAt");
