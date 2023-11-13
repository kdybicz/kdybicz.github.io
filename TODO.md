## Things to-to in the project

- [x] done - Apply `| markdownify }}` to post content and excerpt - [Liquid](https://jekyllrb.com/docs/liquid/filters/)
- [x] failed - Try optimize categories and tags generation with `{{ page.tags | array_to_sentence_string }}` - [Liquid](https://jekyllrb.com/docs/liquid/filters/)
- [x] done - Generate dates filter with `{{ site.members | group_by:"graduation_year" }}` - [Liquid](https://jekyllrb.com/docs/liquid/filters/)
- [x] Consider refactoring `date` into plain date and adding `dateTime` ie. for sorting?
- [x] not possible, paginator limitations - Consider sorting by date, dateTime and/or id for posts from same day `{{ site.pages | sort: "title", "last" }}` - [Liquid](https://jekyllrb.com/docs/liquid/filters/)
- [x] Make sure code highlighting works!
- [x] fix pagination styles
- [x] add projects pages
- [ ] categories hierarchy?
- [x] category translations
- [x] tag translations
- [ ] date translations
- [x] not needed - hide post footer if no category nor tag
- [x] ACTA video fix
- [ ] Remove TODO.md
