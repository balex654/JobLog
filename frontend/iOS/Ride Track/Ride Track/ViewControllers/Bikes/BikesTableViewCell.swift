//
//  BikesTableViewCell.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/28/22.
//

import UIKit

class BikesTableViewCell: UITableViewCell {

    @IBOutlet weak var BikeLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
