require "jekyll"

module Jekyll
  class TranslateTag < Liquid::Tag

    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def render(context)
      rendered_input = Liquid::Template.parse(@input).render(context)

      attributes = {}
      rendered_input.scan(::Liquid::TagAttributes) do |key, value|
        attributes[key] = value
      end

      key = attributes['key']

      site = context.registers[:site]
      translation = site.data['translations'][key]

      unless translation.to_s.strip.empty?
        return "#{translation}"
      else
        return "#{key}"
      end
    end
  end
end

Liquid::Template.register_tag('translate', Jekyll::TranslateTag)
