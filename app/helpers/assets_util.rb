module AssetsUtil
  def self.images
    Dir.glob(Rails.root.join("app/assets/images/**/*.*")).map do |path| 
      path.gsub(Rails.root.join("app/assets/images/").to_s, "")
    end

# 		["background-01.jpg", "background-02.jpg", "background-03.jpg", "default_avatar_01.jpg", "default_avatar_02.png", "default_avatar_03.png"]
  end
end