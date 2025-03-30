Directory structure:
└── windsnow1025-uniwebplatform/
├── README.md
├── K3S.md
├── KubernetesCommand.md
├── LICENSE
├── fastapi/
│   ├── README.md
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── chat_router.py
│   │   │   └── messages_convert_router.py
│   │   ├── logic/
│   │   │   ├── auth.py
│   │   │   ├── chat/
│   │   │   │   ├── chat_service.py
│   │   │   │   ├── handler/
│   │   │   │   │   ├── request_handler.py
│   │   │   │   │   └── response_handler.py
│   │   │   │   └── util/
│   │   │   │       ├── model_pricing.py
│   │   │   │       └── token_counter.py
│   │   │   └── image_gen/
│   │   │       ├── image_gen_client.py
│   │   │       ├── image_gen_parameter.py
│   │   │       ├── image_gen_pricing.py
│   │   │       └── image_gen_service.py
│   │   └── repository/
│   │       ├── db_connection.py
│   │       ├── user_entity.py
│   │       └── user_repository.py
│   ├── request/
│   │   ├── chat.http
│   │   ├── http-client.private.env.example.json
│   │   ├── image_gen.http
│   │   └── messages_convert.http
│   └── tests/
│       ├── __init__.py
│       └── basic_test.py
├── kubernetes/
│   ├── app-configmap.yaml
│   ├── app-secret.example.yaml
│   ├── dashboard/
│   │   ├── dashboard-clusterrolebinding.yaml
│   │   ├── dashboard-secret-public.yaml
│   │   ├── dashboard-service.yaml
│   │   └── dashboard-serviceaccount.yaml
│   ├── fastapi/
│   │   ├── fastapi-deployment-test.yaml
│   │   ├── fastapi-deployment.yaml
│   │   └── fastapi-service.yaml
│   ├── minio/
│   │   ├── minio-configmap.yaml
│   │   ├── minio-deployment.yaml
│   │   ├── minio-pvc.yaml
│   │   └── minio-service.yaml
│   ├── mysql/
│   │   ├── mysql-deployment.yaml
│   │   ├── mysql-pvc.yaml
│   │   └── mysql-service.yaml
│   ├── nest/
│   │   ├── nest-deployment-test.yaml
│   │   ├── nest-deployment.yaml
│   │   └── nest-service.yaml
│   ├── next/
│   │   ├── next-deployment-test.yaml
│   │   ├── next-deployment.yaml
│   │   └── next-service.yaml
│   └── nginx/
│       ├── default.conf
│       ├── nginx-configmap.yaml
│       ├── nginx-deployment.yaml
│       └── nginx-service.yaml
├── nest/
│   ├── README.md
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── openapitools.json
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   ├── .dockerignore
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .gitignore
│   ├── .prettierrc
│   ├── config/
│   │   └── configuration.ts
│   ├── src/
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── announcement/
│   │   │   ├── announcement.controller.ts
│   │   │   ├── announcement.entity.ts
│   │   │   ├── announcement.module.ts
│   │   │   ├── announcement.service.ts
│   │   │   └── dto/
│   │   │       ├── announcement.req.dto.ts
│   │   │       └── announcement.res.dto.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── auth.req.dto.ts
│   │   │   │   └── auth.res.dto.ts
│   │   │   └── interfaces/
│   │   │       ├── jwt-payload.interface.ts
│   │   │       └── request-with-user.interface.ts
│   │   ├── bookmarks/
│   │   │   ├── bookmark.entity.ts
│   │   │   ├── bookmarks.controller.ts
│   │   │   ├── bookmarks.module.ts
│   │   │   ├── bookmarks.service.ts
│   │   │   └── dto/
│   │   │       ├── bookmark.req.dto.ts
│   │   │       └── bookmark.res.dto.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   ├── allow-unverified-email.decorator.ts
│   │   │   │   ├── public.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── entities/
│   │   │   │   └── base.entity.ts
│   │   │   ├── enums/
│   │   │   │   └── role.enum.ts
│   │   │   └── guards/
│   │   │       ├── email-verification.guard.ts
│   │   │       └── roles.guard.ts
│   │   ├── conversations/
│   │   │   ├── conversation.entity.ts
│   │   │   ├── conversations.controller.ts
│   │   │   ├── conversations.module.ts
│   │   │   ├── conversations.service.ts
│   │   │   ├── message.entity.ts
│   │   │   └── dto/
│   │   │       ├── conversation.req.dto.ts
│   │   │       └── conversation.res.dto.ts
│   │   ├── files/
│   │   │   ├── files.controller.ts
│   │   │   ├── files.module.ts
│   │   │   ├── files.service.ts
│   │   │   ├── minio.service.ts
│   │   │   └── dto/
│   │   │       ├── files.req.dto.ts
│   │   │       └── files.res.dto.ts
│   │   ├── markdowns/
│   │   │   ├── markdown.entity.ts
│   │   │   ├── markdowns.controller.ts
│   │   │   ├── markdowns.module.ts
│   │   │   ├── markdowns.service.ts
│   │   │   └── dto/
│   │   │       ├── markdown.req.dto.ts
│   │   │       └── markdown.res.dto.ts
│   │   └── users/
│   │       ├── firebase.service.ts
│   │       ├── user.entity.ts
│   │       ├── users.controller.ts
│   │       ├── users.module.ts
│   │       ├── users.service.spec.ts
│   │       ├── users.service.ts
│   │       └── dto/
│   │           ├── user.privileges.req.dto.ts
│   │           ├── user.req.dto.ts
│   │           └── user.res.dto.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   ├── jest-e2e.json
│   │   └── request/
│   │       ├── files.http
│   │       └── http-client.private.env.example.json
│   └── .run/
│       ├── start_dev.run.xml
│       └── test.run.xml
├── next/
│   ├── README.md
│   ├── Dockerfile
│   ├── jest.config.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .dockerignore
│   ├── .env.development
│   ├── .env.production
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── app/
│   │   ├── components/
│   │   │   ├── bookmark/
│   │   │   │   └── BookmarkDataGrid.js
│   │   │   ├── chat/
│   │   │   │   ├── AddMessageDivider.js
│   │   │   │   ├── ChatMessagesDiv.js
│   │   │   │   ├── ClearButton.js
│   │   │   │   ├── ConversationSidebar.js
│   │   │   │   ├── SendButton.js
│   │   │   │   ├── SettingsDiv.js
│   │   │   │   ├── ShareConversationDialog.js
│   │   │   │   ├── StatesDiv.js
│   │   │   │   └── ToggleConversationButton.js
│   │   │   ├── common/
│   │   │   │   ├── AnnouncementSnackbar.js
│   │   │   │   ├── ConfirmDialog.js
│   │   │   │   ├── CustomDataGrid.js
│   │   │   │   ├── EmailVerificationDialog.js
│   │   │   │   └── settings/
│   │   │   │       ├── AdminSetting.js
│   │   │   │       ├── DeveloperSettings.js
│   │   │   │       ├── StorageSettings.js
│   │   │   │       └── auth/
│   │   │   │           ├── AuthSettings.js
│   │   │   │           ├── signed-in/
│   │   │   │           │   ├── AccountDiv.js
│   │   │   │           │   ├── AvatarSection.js
│   │   │   │           │   ├── CreditSection.js
│   │   │   │           │   ├── EmailSection.js
│   │   │   │           │   ├── PasswordSection.js
│   │   │   │           │   └── UsernameSection.js
│   │   │   │           └── signed-out/
│   │   │   │               └── SignDiv.js
│   │   │   ├── message/
│   │   │   │   ├── MessageDiv.js
│   │   │   │   ├── content/
│   │   │   │   │   ├── SortableContent.js
│   │   │   │   │   ├── SortableContents.js
│   │   │   │   │   ├── create/
│   │   │   │   │   │   ├── AddContentArea.js
│   │   │   │   │   │   ├── AudioRecord.js
│   │   │   │   │   │   ├── FileDropZone.js
│   │   │   │   │   │   └── FileUpload.js
│   │   │   │   │   ├── display/
│   │   │   │   │   │   └── DisplayDiv.js
│   │   │   │   │   ├── file/
│   │   │   │   │   │   ├── FileDiv.js
│   │   │   │   │   │   ├── FilePreview.js
│   │   │   │   │   │   ├── SortableFile.js
│   │   │   │   │   │   └── SortableFiles.js
│   │   │   │   │   └── text/
│   │   │   │   │       └── TextContent.js
│   │   │   │   └── role/
│   │   │   │       ├── RoleDiv.js
│   │   │   │       └── RoleSelect.js
│   │   │   └── password/
│   │   │       └── PasswordGenerator.tsx
│   │   ├── hooks/
│   │   │   └── useScreenSize.tsx
│   │   └── utils/
│   │       └── Wait.ts
│   ├── client/
│   │   ├── api.ts
│   │   ├── base.ts
│   │   ├── common.ts
│   │   ├── configuration.ts
│   │   ├── git_push.sh
│   │   ├── index.ts
│   │   ├── .gitignore
│   │   ├── .npmignore
│   │   ├── .openapi-generator-ignore
│   │   └── .openapi-generator/
│   │       ├── FILES
│   │       └── VERSION
│   ├── pages/
│   │   ├── 404.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.js
│   │   ├── ai/
│   │   │   └── index.js
│   │   ├── api/
│   │   │   └── fetchMarkdown.js
│   │   ├── auth/
│   │   │   ├── signin.js
│   │   │   └── signup.js
│   │   ├── bookmark/
│   │   │   └── index.js
│   │   ├── markdown/
│   │   │   ├── index.js
│   │   │   ├── add/
│   │   │   │   └── index.js
│   │   │   ├── update/
│   │   │   │   └── [id].js
│   │   │   └── view/
│   │   │       └── [filename].js
│   │   ├── password/
│   │   │   └── index.js
│   │   └── settings/
│   │       └── index.js
│   ├── public/
│   │   ├── manifest.json
│   │   ├── robot.txt
│   │   └── markdown/
│   │       └── chat-doc.md
│   ├── src/
│   │   ├── global.css
│   │   ├── announcement/
│   │   │   ├── AnnouncementClient.ts
│   │   │   └── AnnouncementLogic.ts
│   │   ├── bookmark/
│   │   │   ├── Bookmark.ts
│   │   │   ├── BookmarkClient.ts
│   │   │   └── BookmarkLogic.ts
│   │   ├── chat/
│   │   │   ├── ChatClient.ts
│   │   │   ├── ChatLogic.ts
│   │   │   └── ChatResponse.ts
│   │   ├── common/
│   │   │   ├── APIConfig.ts
│   │   │   ├── file/
│   │   │   │   ├── FileClient.ts
│   │   │   │   └── FileLogic.ts
│   │   │   ├── message/
│   │   │   │   ├── CodeFileExtensions.ts
│   │   │   │   ├── EditableState.ts
│   │   │   │   └── SortableContent.ts
│   │   │   ├── public/
│   │   │   │   └── PublicClient.ts
│   │   │   └── user/
│   │   │       ├── AuthClient.ts
│   │   │       ├── UserClient.ts
│   │   │       └── UserLogic.ts
│   │   ├── conversation/
│   │   │   ├── ConversationClient.ts
│   │   │   └── ConversationLogic.ts
│   │   ├── image/
│   │   │   └── ImageClient.ts
│   │   ├── markdown/
│   │   │   ├── MarkdownClient.ts
│   │   │   └── MarkdownLogic.ts
│   │   └── password/
│   │       ├── PasswordLogic.test.ts
│   │       └── PasswordLogic.ts
│   └── .idea/
│       ├── modules.xml
│       ├── next.iml
│       ├── vcs.xml
│       ├── .gitignore
│       ├── codeStyles/
│       │   └── codeStyleConfig.xml
│       ├── inspectionProfiles/
│       │   └── Project_Default.xml
│       └── runConfigurations/
│           ├── build.xml
│           ├── dev.xml
│           └── test.xml
├── playwright/
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── playwright.config.ts
│   ├── playwright.iml
│   ├── .gitignore
│   ├── tests/
│   │   ├── user.spec.ts
│   │   └── user.ts
│   └── .idea/
│       ├── misc.xml
│       ├── modules.xml
│       ├── vcs.xml
│       ├── .gitignore
│       └── runConfigurations/
│           └── test.xml
└── .github/
└── workflows/
├── fastapi-docker-publish.yml
├── fastapi-python-test.yaml
├── nest-docker-publish.yml
├── nest-node-test.yml
├── next-docker-publish.yml
└── next-node-test.yml
