---
name: skill-packaging
description: |
  **Skill Packaging & Distribution Checklist**: Follow this skill whenever you edit, create, or update any SKILL.md file in the project's `.skills/` directory. It ensures the updated skill is packaged as a `.skill` zip archive and presented to the user via `present_files` so they can install it with the "Copy to your skills" button. Without this step, skill edits stay local and don't propagate to the user's installed skills. MANDATORY TRIGGERS: SKILL.md, skill file, edit skill, update skill, create skill, skill update, write skill, modify skill, .skill, package skill, skill packaging, skill distribution, copy to skills
---

# Skill Packaging & Distribution

Every time you create or edit a SKILL.md file inside the project's `.skills/` directory, the user's installed copy (in their mounted `.skills/skills/` path) won't automatically update. You need to package the skill as a `.skill` zip and present it so the user can install it.

## When This Applies

Any time you:
- Create a new skill directory with a SKILL.md
- Edit an existing SKILL.md (content, frontmatter, description)
- Add or modify bundled resources (scripts, references, assets) inside a skill directory

## Packaging Steps

1. **Zip from the parent directory** so the archive contains the skill folder at root level:
   ```bash
   cd <project>/.skills && zip -r /tmp/<skill-name>.skill <skill-name>/
   ```

2. **Copy to the workspace folder** so `present_files` can access it:
   ```bash
   cp /tmp/<skill-name>.skill <workspace-mount>/<skill-name>.skill
   ```

3. **Present the file** using `present_files` — this renders a card with a "Copy to your skills" install button:
   ```
   present_files([{ file_path: "<workspace-mount>/<skill-name>.skill" }])
   ```

## Why This Matters

The `.skills/` directory inside the project is the working copy. The user's installed skills live in a separate mounted location (typically `.skills/skills/`). Without packaging and presenting, edits are invisible to the user's skill library. The `.skill` file (a zip archive) is the transport mechanism — presenting it gives the user a one-click install button.

## Multiple Skills in One Session

If you edit several skills in the same session, package and present each one. You can present multiple `.skill` files in a single `present_files` call.

## Common Mistake

Writing the SKILL.md directly to the read-only mounted `.skills/skills/` path will fail with `EROFS: read-only file system`. Always edit in the project's `.skills/` directory, then package and present.
