//
//  BikesViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/28/22.
//

import UIKit

class BikesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var bikes: [Bike] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        getBikes()
    }
    
    func getBikes() {
        Task {
            bikes = await HttpService.getBikes()
            tableView.reloadData()
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return bikes.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "bikesTableViewCell", for: indexPath) as! BikesTableViewCell
        let currentBike = bikes[indexPath.row]
        cell.BikeLabel.text = currentBike.name
        return cell
    }
    
    @IBAction func AddBikeAction(_ sender: Any) {
        let alert = UIAlertController(title: "Add Bike", message: nil, preferredStyle: .alert)
        alert.addTextField{ (UITextField) in
            UITextField.placeholder = "Name"
        }
        alert.addTextField{ (UITextField) in
            UITextField.placeholder = "Weight (kg)"
            UITextField.keyboardType = .decimalPad
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Add", style: .default, handler: { action in
            let name = alert.textFields![0] as UITextField
            let weight = alert.textFields![1] as UITextField
            Task {
                await HttpService.createBike(bike: Bike(id: 0, weight: Double(weight.text!)!, name: name.text!, user_id: ""))
                self.getBikes()
            }
        }))
        self.present(alert, animated: true)
    }
}
